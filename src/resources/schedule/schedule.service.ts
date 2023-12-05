import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateScheduleDto,
  ScheduleDto,
  UpdateScheduleDto,
} from 'cartelera-unahur';
import { Schedule } from 'src/entities/schedule.entity';
import * as DateUtils from 'src/utils/dateUtils';
import { In, Repository } from 'typeorm';

type Status = 'active' | 'today' | 'pending' | 'deprecated';

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
          deletedAt: new Date(),
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

  public reduceStatus(statusArray: Status[]): Status {
    return statusArray.reduce((status, statusElement) => {
      return !(status === 'active' || status === 'today')
        ? statusElement
        : status;
    }, 'deprecated');
  }

  public getScheduleStatus(schedule: any): Status {
    const currentDate = DateUtils.getNewLocalDate();
    const startDate = DateUtils.getLocalDate(schedule.startDate);
    const endDate = DateUtils.getLocalDate(schedule.endDate);
    const inRange = startDate <= currentDate && endDate >= currentDate;
    const isToday = schedule.dayCode === this.getDayCode(currentDate.getDay());
    const isActive = this.isInHourRange(
      currentDate,
      DateUtils.getLocalDate(schedule.startHour),
      DateUtils.getLocalDate(schedule.endHour),
    );
    const status =
      endDate < currentDate
        ? 'deprecated'
        : inRange
        ? isToday
          ? isActive
            ? 'active'
            : 'today'
          : 'pending'
        : 'pending';
    return status;
  }

  private isInHourRange(
    timeToValidate: Date,
    timeStart: Date,
    timeEnd: Date,
  ): boolean {
    const totalSecondsNow = this.getSeconds(
      DateUtils.getDateTimeString(timeToValidate),
    );
    const totalSecondsStart = this.getSeconds(
      DateUtils.getDateTimeString(timeStart),
    );
    const totalSecondsEnd = this.getSeconds(
      DateUtils.getDateTimeString(timeEnd),
    );
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
}
