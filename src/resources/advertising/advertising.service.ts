import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { SocketService } from '../../plugins/socket/socket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Advertising } from '../../entities/advertising.entity';
import { Repository } from 'typeorm';
import { CreateAdvertisingDto, UpdateAdvertisingDto } from 'cartelera-unahur';
import { ScheduleService } from '../schedule/schedule.service';
import { AdvertisingScheduleService } from '../advertising-schedule/advertising-schedule.service';

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
  ) {}

  public async create(createAdvertisingDto: CreateAdvertisingDto) {
    const newAdvertising =
      this.advertisingRepository.create(createAdvertisingDto);
    const advertisingCreated = await this.advertisingRepository.save(
      newAdvertising,
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

    this.socketService.sendMessage('advertising', {
      id: 1,
      advertisingTypeId: 1,
      title: 'aviso default',
      payload: 'url default',
    });
    return advertisingCreated;
  }

  public async findAll() {
    return this.advertisingRepository.find();
  }

  public async findTodayScreenAdvertising(screenId: number) {
    // TODO: Tipar output
    const avisos = await this.advertisingRepository.find({
      where: {
        deletedAt: null,
        sector: {
          screens: {
            id: screenId,
          },
        },
      },
      relations: [
        'sector',
        'sector.screens',
        'advertisingSchedules',
        'advertisingSchedules.schedule',
      ],
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
      relations: [
        'user',
        'user.role',
        'advertisingType',
        'sector',
        'advertisingSchedules',
        'advertisingSchedules.schedule',
      ],
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
    // TODO: Fixear null
    const currentDate = new Date();
    let status: 'active' | 'today' | 'pending' | 'deprecated' = null;
    advertising.advertisingSchedules.map((advertisingSchedule) => {
      const inRange =
        advertisingSchedule.schedule.startDate <= currentDate &&
        advertisingSchedule.schedule.endDate >= currentDate;
      const isDayToday =
        advertisingSchedule.schedule.dayCode ===
        this.getDayCode(currentDate.getDay() - 1);
      if (status !== 'active') {
        if (advertisingSchedule.schedule.endDate < currentDate) {
          status = 'deprecated';
        } else if (inRange) {
          if (isDayToday) {
            if (
              this.estaEnHorarioActual(
                advertisingSchedule.schedule.startHour,
                advertisingSchedule.schedule.endHour,
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

  private estaEnHorarioActual(horaInicio, horaFin) {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActuales = ahora.getMinutes();

    const horaInicioHoras = horaInicio.getHours();
    const minutosInicio = horaInicio.getMinutes();
    const horaFinHoras = horaFin.getHours();
    const minutosFin = horaFin.getMinutes();

    const horaActualEnMinutos = horaActual * 60 + minutosActuales;
    const horaInicioEnMinutos = horaInicioHoras * 60 + minutosInicio;
    const horaFinEnMinutos = horaFinHoras * 60 + minutosFin;

    return (
      horaActualEnMinutos >= horaInicioEnMinutos &&
      horaActualEnMinutos <= horaFinEnMinutos
    );
  }

  public async findOne(id: number): Promise<Advertising> {
    try {
      const [response] = await this.advertisingRepository.find({
        relations: [
          'user',
          'user.role',
          'sector',
          'advertisingType',
          'advertisingSchedules',
          'advertisingSchedules.schedule',
        ],
        where: { id, deletedAt: null },
      });
      return response;
    } catch (error) {
      console.error('FIND_ONE_ERROR: ', error);
      throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateAdvertisingDto: UpdateAdvertisingDto) {
    // TODO: CONTINUAR ACA
    try {
      const advertisingFound = await this.findOne(id);

      // TODO: Encontrar los schedules a eliminar
      const { scheduleWithId, scheduleWithoutId } =
        updateAdvertisingDto.schedules.reduce(
          (reducer, schedule) => {
            if (schedule.id) {
              reducer.scheduleWithId.push(schedule);
            } else {
              reducer.scheduleWithoutId.push(schedule);
            }
            return reducer;
          },
          { scheduleWithId: [], scheduleWithoutId: [] },
        );
      const schedulesWithId = scheduleWithId.map((schedule) => schedule.id);
      const schedulesToDelete = advertisingFound.advertisingSchedules.filter(
        (advertisingSchedule) =>
          !schedulesWithId.includes(advertisingSchedule.schedule.id),
      );
      const scheduleIdsToDelete = schedulesToDelete.map((a) => a.schedule.id);
      if (scheduleIdsToDelete.length) {
        await this.scheduleService.removeMultiple(scheduleIdsToDelete);
      }

      // TODO: Crear nuevos schedules
      // TODO: Crear un nuevo Schedule por cada scheduleWithoutId
      // TODO: Crear un nuevo AdvertisingSchedule por cada Schedule creado
      // TODO: Atualizar datos del aviso como sector, nombre, tipo de aviso (evaluar), payload

      // this.advertisingRepository.update({ id }, updateAdvertisingDto);

      return {};
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
