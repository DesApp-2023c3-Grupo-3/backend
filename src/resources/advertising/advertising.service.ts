import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { SocketService } from '../../plugins/socket/socket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Advertising } from '../../entities/advertising.entity';
import { And, Repository } from 'typeorm';
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
    // Crear Advertsing
    const newAdvertising =
      this.advertisingRepository.create(createAdvertisingDto);
    const advertisingCreated = await this.advertisingRepository.save(
      newAdvertising,
    );

    // Crear Schedules
    const schedulesCreated = await Promise.all(
      createAdvertisingDto.schedules.map(async (shceduleToCreate) => {
        // TODO: agregar Schedules al DTO
        return await this.scheduleService.create({
          startDate: shceduleToCreate.startDate,
          endDate: shceduleToCreate.endDate,
          startHour: shceduleToCreate.startHour,
          endHour: shceduleToCreate.endHour,
          dayCode: this.getDayCode(parseInt(shceduleToCreate.dayCode)), // TODO: Hacer que esto ande
        });
      }),
    );

    // Crear Relacion entre Advertising y Schedule

    const advertisingSchedulesCreated = await Promise.all(
      schedulesCreated.map(async (scheduleCreated) => {
        return await this.advertisingScheduleService.create({
          advertising: { id: advertisingCreated.id },
          schedule: { id: scheduleCreated.id },
        });
      }),
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

  public async findAll() {
    return this.advertisingRepository.find();
  }

  public async findAllRole(roleId: number) {
    const avisos = await this.advertisingRepository.find({
      where: {
        user: {
          role: {
            id: roleId,
          },
        },
      }, // TODO: Filtrar por rol
      relations: [
        'user',
        'user.role',
        'advertisingType',
        'sector',
        'advertisingSchedules',
        'advertisingSchedules.schedule',
      ], // TODO: Traerte el schedule
    });
    return avisos.map((aviso) => ({
      ...aviso,
      status: this.getStatus(aviso),
    }));
  }

  public getDayCode(code: number) {
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

  // TODO: Armarte funcion para obtener el status

  // Deprecated: la fecha actual esta delante de el endDate de TODOS los schedules
  // Pending: si la fecha actual esta dentro del rango de fechas pero a NINGUN schedule le corresponde el dia
  // Today: Si la fecha actual esta dentro del rango de fechas y a un schedule le corresponde el dia pero NO el rango de horas
  // Active: Si la fecha actual esta dentro del rango de fechas y a un schedule le corresponde el dia y el rango de horas

  public getStatus(
    advertising: Advertising,
  ): 'active' | 'today' | 'pending' | 'deprecated' {
    const currentDate = new Date();
    let status: 'active' | 'today' | 'pending' | 'deprecated' = 'active';
    advertising.advertisingSchedules.map((schedule) => {
      console.log('Actual: ', currentDate.getTime());
      console.log('Actual: ', currentDate);
      console.log('Inicio: ', schedule.schedule.startDate);
      console.log('Inicio: ', schedule.schedule.startDate.getTime());
      console.log('Fin: ', schedule.schedule.endDate);

      if (schedule.schedule.endDate < currentDate) {
        status = 'deprecated';
      }
      if (
        schedule.schedule.startDate <= currentDate &&
        schedule.schedule.endDate >= currentDate
      ) {
        status = 'pending';
      }
      if (
        schedule.schedule.startDate <= currentDate &&
        schedule.schedule.endDate >= currentDate &&
        schedule.schedule.dayCode === this.getDayCode(currentDate.getDay() - 1)
      ) {
        status = 'today';
      }
      if (
        schedule.schedule.startDate <= currentDate &&
        schedule.schedule.endDate >= currentDate &&
        schedule.schedule.dayCode ===
          this.getDayCode(currentDate.getDay() - 1) &&
        this.estaEnHorarioActual(
          schedule.schedule.startHour,
          schedule.schedule.endHour,
        )
      ) {
        status = 'active';
      }
    });
    return status;
  }

  estaEnHorarioActual(horaInicio, horaFin) {
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
