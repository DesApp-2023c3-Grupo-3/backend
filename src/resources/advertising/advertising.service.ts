import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { SocketService } from '../../plugins/socket/socket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Advertising } from '../../entities/advertising.entity';
import { Brackets, IsNull, Repository } from 'typeorm';
import { CreateAdvertisingDto, UpdateAdvertisingDto } from 'cartelera-unahur';
import { ScheduleService } from '../schedule/schedule.service';
import { AdvertisingScheduleService } from '../advertising-schedule/advertising-schedule.service';
import { AdvertisingSectorService } from '../advertising-sector/advertising-sector.service';
import { SectorService } from '../sector/sector.service';
import { MessageDto } from 'src/plugins/socket/dto/Message.dto';
import {
  getNewLocalDate,
  getNewLocalDateCompareDate,
} from 'src/utils/dateUtils';

@Injectable()
export class AdvertisingService {
  constructor(
    @InjectRepository(Advertising)
    private readonly advertisingRepository: Repository<Advertising>,
    private readonly socketService: SocketService,
    @Inject(ScheduleService)
    private readonly scheduleService: ScheduleService,
    @Inject(SectorService)
    private readonly sectorService: SectorService,
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
          dayCode: this.scheduleService.getDayCode(
            parseInt(shceduleToCreate.dayCode),
          ),
        });
      }),
    );
    await Promise.all(
      schedulesCreated.map(async (scheduleCreated) => {
        return await this.advertisingScheduleService.create({
          advertising: { id: advertisingCreated.id },
          schedule: { id: scheduleCreated.id },
        });
      }),
    );

    const advertisingFound = await this.findOne(newAdvertising.id);
    const anySchedule = advertisingFound.advertisingSchedules[0].schedule;
    this.sendAdvertisingMessage(advertisingFound, {
      id: 1,
      action: 'CREATE_ADVERTISING',
      data: {
        advertisingTypeId: advertisingFound.advertisingType.id,
        payload: advertisingFound.payload,
        advertisingId: advertisingFound.id,
        startHour: anySchedule.startHour,
        endHour: anySchedule.endHour,
      },
    });
    return advertisingCreated;
  }

  public async findPageAndLimit(page: number, limit: number, search = '') {
    const hour = await getNewLocalDateCompareDate();
    const day = this.scheduleService.getDayCode(
      await getNewLocalDate().getDay(),
    );
    const offset = (page - 1) * limit;

    const subQuery = this.advertisingRepository
      .createQueryBuilder('a2')
      .select([
        'a2.id AS "advertisingId"',
        `CASE 
    WHEN s2."dayCode" = :day AND (:hour BETWEEN s2."startHour" AND s2."endHour") THEN 1 
    WHEN s2."dayCode" = :day AND NOT (:hour BETWEEN s2."startHour" AND s2."endHour") AND (:hour < s2."startHour")THEN 2
    WHEN NOT (:hour BETWEEN s2."startDate" AND s2."endDate") THEN 4
    ELSE 3 
    END AS "statusId"`,
        's2."startDate"',
        's2."endDate"',
        's2."startHour"',
        's2."endHour"',
      ])
      .innerJoin('AdvertisingSchedule', 'ads2', 'a2.id = ads2."advertisingId"')
      .innerJoin('Schedule', 's2', 's2.id = ads2."scheduleId"');

    const query = this.advertisingRepository
      .createQueryBuilder('a')
      .select([
        'a.*',
        `JSON_AGG(DISTINCT(
    jsonb_build_object(
    'schedule', jsonb_build_object(
    'startDate', s."startDate",
    'endDate', s."endDate",
    'startHour', s."startHour",
    'endHour', s."endHour",
    'dayCode', s."dayCode"
    )
    ) 
    ) 
    ) AS "advertisingSchedules"`,
        `JSON_AGG(DISTINCT(
    jsonb_build_object(
    'sector', jsonb_build_object('id',sec.id,'name',sec.name,'topic',sec.topic)
    )
    )) AS "advertisingSectors"`,
        `jsonb_build_object('name',MIN(u.name),'role', jsonb_build_object('name', MIN(r.name))) AS "user"`,
        'MIN(sq."statusId") AS "statusId"',
        `CASE 
    WHEN MIN(sq."statusId") = 1 THEN 'active'
    WHEN MIN(sq."statusId") = 2 THEN 'today'
    WHEN MIN(sq."statusId") = 3 THEN 'pending'
    ELSE 'deprecated' 
    END AS status`,
        `jsonb_build_object('id', MIN(a.advertisingTypeId)) AS "advertisingType"`,
      ])
      .innerJoin(`(${subQuery.getQuery()})`, 'sq', 'sq."advertisingId" = a.id')
      .innerJoin('AdvertisingSchedule', 'ads', 'a.id = ads."advertisingId"')
      .innerJoin('Schedule', 's', 's.id = ads."scheduleId"')
      .innerJoin('AdvertisingSector', 'asec', 'a.id = asec."advertisingId"')
      .innerJoin('Sector', 'sec', 'sec.id = asec."sectorId"')
      .leftJoin('User', 'u', 'u.id = a."userId"')
      .leftJoin('Role', 'r', 'r.id = u."roleId"')
      .where('a.deletedAt IS NULL')
      .groupBy('a.id')
      .orderBy('MIN("statusId")', 'ASC')
      .setParameters({ hour, day })
      .offset(offset)
      .limit(limit);

    const applySearchFilter = (qb) => {
      if (search.length > 1) {
        qb.andWhere(
          new Brackets((qb2) => {
            qb2
              .where('LOWER(a.name) LIKE LOWER(:searchTerm)', {
                searchTerm: `%${search}%`,
              })
              .orWhere('LOWER(u.name) LIKE LOWER(:searchTerm)', {
                searchTerm: `%${search}%`,
              });
          }),
        );
      }
    };
    applySearchFilter(query);
    const totalQuery = this.advertisingRepository
      .createQueryBuilder('a')
      .select('COUNT(a.id)', 'total')
      .leftJoin('User', 'u', 'u.id = a."userId"')
      .where('a.deletedAt IS NULL');
    applySearchFilter(totalQuery);

    const totalRecords = await totalQuery.getRawOne();
    const total = parseInt(totalRecords.total, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data: await query.getRawMany(),
      page: page,
      total: total,
      limit: limit,
      totalPages,
    };
  }

  public async findAll() {
    const avisos = await this.advertisingRepository.find({
      where: {
        deletedAt: IsNull(),
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
      status: this.getAdvertisingStatus(aviso),
    }));
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
        advertisingType: true,
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
      status: this.getAdvertisingStatus(aviso),
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
      status: this.getAdvertisingStatus(aviso),
    }));
  }

  private getAdvertisingStatus(
    advertising: Advertising,
  ): 'active' | 'today' | 'pending' | 'deprecated' {
    const statusArray = advertising.advertisingSchedules.map(
      (advertisingSchedule) =>
        this.scheduleService.getScheduleStatus(advertisingSchedule.schedule),
    );
    return this.scheduleService.reduceStatus(statusArray);
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
              dayCode: this.scheduleService.getDayCode(
                parseInt(shceduleToCreate.dayCode),
              ),
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
            dayCode: this.scheduleService.getDayCode(
              parseInt(scheduleToUpdate.dayCode),
            ),
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
      const advertisingUpdatedFound = await this.findOne(id);
      const anySchedule =
        advertisingUpdatedFound.advertisingSchedules[0].schedule;
      this.sendAdvertisingMessage(advertisingUpdatedFound, {
        id: 1,
        action: 'UPDATE_ADVERTISING',
        data: {
          advertisingTypeId: advertisingUpdatedFound.advertisingType.id,
          payload: advertisingUpdatedFound.payload,
          advertisingId: advertisingUpdatedFound.id,
          startHour: anySchedule.startHour,
          endHour: anySchedule.endHour,
        },
      });
      return {
        data: advertisingUpdatedFound,
      };
    } catch (error) {
      console.error('ADVERTISING_UPDATE_ERROR: ', error);
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      const advertisingFound = await this.findOne(id);
      if (!advertisingFound) {
        throw new HttpException(
          'Advertising not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      const { affected } = await this.advertisingRepository.update(
        {
          id,
        },
        {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      );
      let message = 'Advertising not deleted';
      if (affected) {
        message = 'Advertising deleted successfully';
        const anySchedule = advertisingFound.advertisingSchedules[0].schedule;
        this.sendAdvertisingMessage(advertisingFound, {
          id: 1,
          action: 'DELETE_ADVERTISING',
          data: {
            advertisingTypeId: advertisingFound.advertisingType.id,
            payload: advertisingFound.payload,
            advertisingId: advertisingFound.id,
            startHour: anySchedule.startHour,
            endHour: anySchedule.endHour,
          },
        });
      }
      return { message };
    } catch (error) {
      throw new HttpException('Error on delete', HttpStatus.BAD_REQUEST);
    }
  }

  private async sendAdvertisingMessage(
    advertising: Advertising,
    data: MessageDto,
  ) {
    const schedulesFound = advertising.advertisingSchedules.map(
      (advertisingSchedule) => advertisingSchedule.schedule,
    );
    const schedulesStatus = schedulesFound.map((scheduleCreated) =>
      this.scheduleService.getScheduleStatus(scheduleCreated),
    );
    const status = this.scheduleService.reduceStatus(schedulesStatus);
    if (['today', 'active'].includes(status)) {
      const sectorIds = advertising.advertisingSectors.map(
        (advertisingSector) => advertisingSector.sector.id,
      );
      const sectorsFound = await this.sectorService.findByIds(sectorIds);
      const sectorTopics = sectorsFound.map((sectorFound) => sectorFound.topic);
      sectorTopics.map((sectorTopic) => {
        this.socketService.sendMessage(sectorTopic, data);
      });
    }
  }
}
