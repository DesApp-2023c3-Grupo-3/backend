import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateScheduleDto,
  ScheduleDto,
  UpdateScheduleDto,
} from 'cartelera-unahur';
import { Schedule } from 'src/entities/schedule.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  public createEntity(createScheduleDto: CreateScheduleDto): Schedule {
    return this.scheduleRepository.create(createScheduleDto);
  }

  public async create(createScheduleDto: CreateScheduleDto) {
    const newSchedule = this.scheduleRepository.create(createScheduleDto);
    const created = await this.scheduleRepository.save(newSchedule);
    return created;
  }

  public async createMultiple(createSubjectDtos: CreateScheduleDto[]) {
    const subjectsToCreate = createSubjectDtos.map((createSubjectDto) =>
      this.scheduleRepository.create(createSubjectDto),
    );
    return this.scheduleRepository.save(subjectsToCreate);
  }

  public async findAll() {
    return this.scheduleRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.scheduleRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('Schedule not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    try {
      return this.scheduleRepository.update({ id }, updateScheduleDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.scheduleRepository.update(
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

  public async updateMultiple(schedules: Schedule[]) {
    try {
      return this.scheduleRepository.save(schedules);
    } catch (error) {}
  }

  public async removeMultiple(ids: number[]) {
    try {
      return this.scheduleRepository.update(
        { id: In(ids) },
        {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      );
    } catch (error) {}
  }

  public reduceStatus(
    statusArray: Array<'active' | 'today' | 'pending' | 'deprecated'>,
  ): 'active' | 'today' | 'pending' | 'deprecated' {
    return statusArray.reduce((status, statusElement) => {
      return !(status === 'active' || status === 'today')
        ? statusElement
        : status;
    }, 'deprecated');
  }

  public getScheduleStatus(
    schedule: any,
  ): 'active' | 'today' | 'pending' | 'deprecated' {
    const currentDate = new Date();
    let status: 'active' | 'today' | 'pending' | 'deprecated';
    const startDate = new Date(schedule.startDate);
    const endDate = new Date(schedule.endDate);
    const inRange = startDate <= currentDate && endDate >= currentDate;
    const isToday =
      schedule.dayCode === this.getDayCode(currentDate.getDay() - 1);
    if (endDate < currentDate) {
      status = 'deprecated';
    } else if (inRange) {
      if (isToday) {
        if (
          this.isActive(
            new Date(schedule.startHour),
            new Date(schedule.endHour),
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

  public getDayCode(code: number) {
    const defaultDay = 'DO';
    const dayCodes = {
      0: 'DO',
      1: 'LU',
      2: 'MA',
      3: 'MI',
      4: 'JU',
      5: 'VI',
      6: 'SA',
    };
    return dayCodes[String(code)] || defaultDay;
  }

  public getDayName(dayCode: string) {
    const defaultDay = 0;
    const dayNames = {
      DO: 0,
      LU: 1,
      MA: 2,
      MI: 3,
      JU: 4,
      VI: 5,
      SA: 6,
    };
    return dayNames[dayCode] || defaultDay;
  }

  private getSeconds(stringTime: string): number {
    const [hour, minutes, seconds] = stringTime.split(':').map(Number);
    return hour * 3600 + minutes * 60 + seconds;
  }

  public currentDate() {
    const fechaActual = new Date();
    const timeZoneOffset = -3 * 60;
    return new Date(fechaActual.getTime() + timeZoneOffset * 60 * 1000);
  }
}
