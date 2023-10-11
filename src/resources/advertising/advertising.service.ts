import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { SocketService } from '../../plugins/socket/socket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Advertising } from '../../entities/advertising.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateAdvertisingDto, UpdateAdvertisingDto } from 'cartelera-unahur';
import { ScheduleService } from '../schedule/schedule.service';
import { AdvertisingScheduleService } from '../advertising-schedule/advertising-schedule.service';
import { AdvertisingSectorService } from '../advertising-sector/advertising-sector.service';

@Injectable()
export class AdvertisingService {
  constructor(
    @InjectRepository(Advertising)
    private readonly advertisingRepository: Repository<Advertising>,
    private readonly socketService: SocketService,
    @Inject(ScheduleService)
    private readonly scheduleService: ScheduleService,
    @Inject(AdvertisingScheduleService)
    private readonly advertisingScheduleService: AdvertisingScheduleService,
    @Inject(AdvertisingSectorService)
    private readonly advertisingSectorService: AdvertisingSectorService,
  ) {}

  public async create(createAdvertisingDto: CreateAdvertisingDto) {
    const newAdvertising =
      this.advertisingRepository.create(createAdvertisingDto);
    const advertisingCreated = await this.advertisingRepository.save(
      newAdvertising,
    );
    await Promise.all(
      createAdvertisingDto.sectors.map(async (sector) => {
        return await this.advertisingSectorService.create({
          sector,
          advertising: newAdvertising,
        });
      }),
    );
    const schedulesCreated = await Promise.all(
      createAdvertisingDto.schedules.map(async (shceduleToCreate) => {
        return await this.scheduleService.create({
          startDate: shceduleToCreate.startDate,
          endDate: shceduleToCreate.endDate,
          startHour: shceduleToCreate.startHour,
          endHour: shceduleToCreate.endHour,
          dayCode: this.getDayCode(parseInt(shceduleToCreate.dayCode)), // TODO: Hacer que esto ande
        });
      }),
    );
    const advertisingSchedulesCreated = await Promise.all(
      schedulesCreated.map(async (scheduleCreated) => {
        return await this.advertisingScheduleService.create({
          advertising: { id: advertisingCreated.id },
          schedule: { id: scheduleCreated.id },
        });
      }),
    );

    // TODO: Implementar envio de mensajes por sector si se ve hoy
    // this.socketService.sendMessage('advertising', {
    //   id: 1,
    //   advertisingTypeId: 1,
    //   title: 'aviso default',
    //   payload: 'url default',
    // });
    return advertisingCreated;
  }

  public async findAll() {
    return this.advertisingRepository.find();
  }

  public async findTodayScreenAdvertising(screenId: number) {
    const avisos = await this.advertisingRepository.find({
      where: {
        deletedAt: null,
        advertisingSectors: {
          sector: {
            screens: {
              id: screenId,
            },
          },
        },
      },
      relations: {
        advertisingSectors: {
          sector: {
            screens: true,
          },
        },
        advertisingSchedules: {
          schedule: true,
        },
      },
    });
    const advertisingsWithStatus = avisos.map((aviso) => ({
      ...aviso,
      status: this.getStatus(aviso),
    }));
    const filteredAdvertisings = advertisingsWithStatus.filter(
      (advertisingWithStatus) =>
        ['today', 'active'].includes(advertisingWithStatus.status),
    );
    return filteredAdvertisings;
  }

  public async findAllRole(roleId: number) {
    const avisos = await this.advertisingRepository.find({
      where: {
        deletedAt: null,
        user: {
          role: {
            id: roleId,
          },
        },
      },
      relations: {
        user: {
          role: true,
        },
        advertisingType: true,
        advertisingSectors: {
          sector: true,
        },
        advertisingSchedules: {
          schedule: true,
        },
      },
    });
    return avisos.map((aviso) => ({
      ...aviso,
      status: this.getStatus(aviso),
    }));
  }

  private getDayCode(code: number) {
    const defaultDay = 'LU';
    const dayCodes = {
      0: 'LU',
      1: 'MA',
      2: 'MI',
      3: 'JU',
      4: 'VI',
      5: 'SA',
      6: 'DO',
    };
    return dayCodes[String(code)] || defaultDay;
  }

  private getStatus(
    advertising: Advertising,
  ): 'active' | 'today' | 'pending' | 'deprecated' {
    const currentDate = new Date();
    let status: 'active' | 'today' | 'pending' | 'deprecated' = null;
    advertising.advertisingSchedules.map((advertisingSchedule) => {
      const inRange =
        advertisingSchedule.schedule?.startDate <= currentDate &&
        advertisingSchedule.schedule?.endDate >= currentDate;
      const isDayToday =
        advertisingSchedule.schedule?.dayCode ===
        this.getDayCode(currentDate.getDay() - 1);
      if (status !== 'active') {
        if (advertisingSchedule.schedule?.endDate < currentDate) {
          status = 'deprecated';
        } else if (inRange) {
          if (isDayToday) {
            if (
              this.isActive(
                advertisingSchedule.schedule?.startHour,
                advertisingSchedule.schedule?.endHour,
              )
            ) {
              status = 'active';
            } else {
              status = 'today';
            }
          } else {
            status = 'pending';
          }
        }
      }
    });
    return status;
  }

  private isActive(timeStart: Date, timeEnd: Date) {
    const dateNow = new Date();
    const totalSecondsNow = this.getSeconds(dateNow.toLocaleTimeString());
    const totalSecondsStart = this.getSeconds(timeStart.toLocaleTimeString());
    const totalSecondsEnd = this.getSeconds(timeEnd.toLocaleTimeString());
    return (
      totalSecondsStart <= totalSecondsNow && totalSecondsNow <= totalSecondsEnd
    );
  }

  private getSeconds(stringTime: string): number {
    const [hour, minutes, seconds] = stringTime.split(':').map(Number);
    return hour * 3600 + minutes * 60 + seconds;
  }

  public async findOne(id: number): Promise<Advertising> {
    try {
      const [response] = await this.advertisingRepository.find({
        where: {
          id,
          deletedAt: null,
          advertisingSchedules: {
            deletedAt: IsNull(),
            schedule: {
              deletedAt: IsNull(),
            },
          },
          advertisingSectors: {
            deletedAt: IsNull(),
            sector: {
              deletedAt: IsNull(),
            },
          },
        },
        relations: {
          user: {
            role: true,
          },
          advertisingSectors: {
            sector: true,
          },
          advertisingType: true,
          advertisingSchedules: {
            schedule: true,
          },
        },
      });
      return response;
    } catch (error) {
      console.error('FIND_ONE_ERROR: ', error);
      throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateAdvertisingDto: UpdateAdvertisingDto) {
    try {
      const advertisingFound = await this.findOne(id);
      const schedulesFound = advertisingFound.advertisingSchedules.map(
        (advertisingSchedule) => ({
          ...advertisingSchedule.schedule,
          advertisingSchedule,
        }),
      );
      const schedulesToDelete = [];
      const { schedulesToCreate, schedulesToUpdate } =
        updateAdvertisingDto.schedules.reduce(
          (reducer, schedule) => {
            const scheduleFoundIndex = schedulesFound.findIndex(
              (scheduleFound) => scheduleFound.id === schedule.id,
            );
            if (scheduleFoundIndex + 1) {
              reducer.schedulesToUpdate.push(schedule);
              schedulesFound.splice(scheduleFoundIndex, 1);
            } else {
              reducer.schedulesToCreate.push(schedule);
            }
            return reducer;
          },
          { schedulesToCreate: [], schedulesToUpdate: [] },
        );
      schedulesToDelete.push(...schedulesFound);
      if (schedulesToDelete.length) {
        const scheduleIdsToDelete = schedulesToDelete.map(
          (scheduleToDelete) => scheduleToDelete.id,
        );
        const advertisingScheduleIdsToDelete = schedulesToDelete.map(
          (scheduleToDelete) => scheduleToDelete.advertisingSchedule.id,
        );
        await this.scheduleService.removeMultiple(scheduleIdsToDelete);
        await this.advertisingScheduleService.removeMultiple(
          advertisingScheduleIdsToDelete,
        );
      }
      if (schedulesToCreate.length) {
        const schedulesCreated = await Promise.all(
          schedulesToCreate.map(async (shceduleToCreate) => {
            return await this.scheduleService.create({
              startDate: shceduleToCreate.startDate,
              endDate: shceduleToCreate.endDate,
              startHour: shceduleToCreate.startHour,
              endHour: shceduleToCreate.endHour,
              dayCode: this.getDayCode(parseInt(shceduleToCreate.dayCode)),
            });
          }),
        );
        await Promise.all(
          schedulesCreated.map(async (scheduleCreated) => {
            return await this.advertisingScheduleService.create({
              advertising: { id },
              schedule: { id: scheduleCreated.id },
            });
          }),
        );
      }
      if (schedulesToUpdate.length) {
        await this.scheduleService.updateMultiple(
          schedulesToUpdate.map((scheduleToUpdate) => ({
            ...scheduleToUpdate,
            dayCode: this.getDayCode(parseInt(scheduleToUpdate.dayCode)),
          })),
        );
      }
      await this.advertisingRepository.update(
        { id },
        {
          name: updateAdvertisingDto.name,
          advertisingType: updateAdvertisingDto.advertisingType,
          user: updateAdvertisingDto.user,
          payload: updateAdvertisingDto.payload,
        },
      );
      const { advertisingSectorsToDelete } =
        advertisingFound.advertisingSectors.reduce(
          (reducer, advertisingSector) => {
            const sectorIndex = updateAdvertisingDto.sectors.findIndex(
              (sector) => advertisingSector.sector.id === sector.id,
            );
            if (sectorIndex + 1) {
              updateAdvertisingDto.sectors.splice(sectorIndex, 1);
            } else {
              reducer.advertisingSectorsToDelete.push(advertisingSector);
            }
            return reducer;
          },
          { advertisingSectorsToDelete: [] },
        );
      const advertisingSectorsToCreate = updateAdvertisingDto.sectors;
      await this.advertisingSectorService.removeMultiple(
        advertisingSectorsToDelete.map(
          (advertisingSectorToDelete) => advertisingSectorToDelete.id,
        ),
      );
      if (advertisingSectorsToCreate.length) {
        await Promise.all(
          advertisingSectorsToCreate.map(async (advertisingSectorToCreate) => {
            return this.advertisingSectorService.create({
              advertising: advertisingFound,
              sector: advertisingSectorToCreate,
            });
          }),
        );
      }
      return {
        data: await this.findOne(id), // TODO: Evaluar si quitar esto
      };
    } catch (error) {
      console.error('ADVERTISING_UPDATE_ERROR: ', error);
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      const { affected } = await this.advertisingRepository.update(
        {
          id,
        },
        {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      );
      const message = affected
        ? 'Advertising deleted successfully'
        : 'Advertising not deleted';
      return { message };
    } catch (error) {
      throw new HttpException('Error on delete', HttpStatus.BAD_REQUEST);
    }
  }
}
