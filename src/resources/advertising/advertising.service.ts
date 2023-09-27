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
    console.log(createAdvertisingDto);
    // Crear Advertsing
    const newAdvertising =
      this.advertisingRepository.create(createAdvertisingDto);
    const advertisingCreated = await this.advertisingRepository.save(
      newAdvertising,
    );

    // Crear Schedules
    const schedulesCreated = await Promise.all(
      createAdvertisingDto.schedules.map(async (/* shceduleToCreate */) => {
        // TODO: agregar Schedules al DTO
        return await this.scheduleService.create({
          startDate: new Date(),
          endDate: new Date(),
          startHour: '12:00',
          endHour: '11:00',
          scheduleDays: '12',
        });
      }),
    );

    // Crear Relacion entre Advertising y Schedule
    console.log(schedulesCreated);
    console.log('CANTIDAD DE SCHEDULES CREADA', schedulesCreated.length);
    const advertisingSchedulesCreated = await Promise.all(
      schedulesCreated.map(async (scheduleCreated) => {
        console.log('DENTRO DEL MAP');
        return await this.advertisingScheduleService.create({
          advertising: { id: advertisingCreated.id },
          schedule: { id: scheduleCreated.id },
        });
      }),
    );
    console.log('advertisingSchedulesCreated', advertisingSchedulesCreated);
    console.log(
      'CANTIDAD DE advertisingSchedulesCreated CREADA',
      advertisingSchedulesCreated.length,
    );

    // const [advertisingStatus] = await this.getStatus([advertisingCreated]);
    // if (['active', 'today'].find(status => status === advertisingStatus)) {
    //   this.socketService.sendMessage('advertising', {
    //     id: 1,
    //     advertisingTypeId: 1,
    //     title: 'aviso default',
    //     payload: 'url default',
    //   });
    // }
    return advertisingCreated;
  }

  public async getStatus(
    advertisings: Advertising[],
  ): Promise<Array<'active' | 'today' | 'pending' | 'deprecated'>> {
    return advertisings.map((/* advertising */) => 'active');
  }

  public async findAll() {
    return this.advertisingRepository.find();
  }

  public async findAllRole(roleId: number) {
    const avisos = await this.advertisingRepository.find({
      relations: ['user', 'user.role', 'advertisingType', 'schedule', 'sector'],
    });
    const filtradoPorRol = avisos.filter((aviso) => {
      return aviso.user.role && aviso.user.role.id == roleId;
    });
    return filtradoPorRol;
  }

  public async findOne(id: number) {
    try {
      return this.advertisingRepository.find({
        relations: [
          'user',
          'user.role',
          'advertisingType',
          'schedule',
          'sector',
        ],
        where: { id },
      });
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateAdvertisingDto: UpdateAdvertisingDto) {
    try {
      return this.advertisingRepository.update({ id }, updateAdvertisingDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.advertisingRepository.update(
        { id },
        {
          id,
          deletedAt: Date.now(),
        },
      );
    } catch (error) {
      throw new HttpException('Error on delete', HttpStatus.BAD_REQUEST);
    }
  }
}
