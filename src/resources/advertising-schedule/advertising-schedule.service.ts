import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdvertisingSchedule } from 'src/entities/advertising-schedule.entity';
import {
  CreateAdvertisingScheduleDto,
  UpdateAdvertisingScheduleDto,
} from 'cartelera-unahur';

@Injectable()
export class AdvertisingScheduleService {
  constructor(
    @InjectRepository(AdvertisingSchedule)
    private readonly advertisingSchedule: Repository<AdvertisingSchedule>,
  ) {}
  public async create(
    createAdvertisingScheduleDto: CreateAdvertisingScheduleDto,
  ) {
    const newAdvertisingSchedule = this.advertisingSchedule.create(
      createAdvertisingScheduleDto,
    );
    const created = await this.advertisingSchedule.save(newAdvertisingSchedule);
    return created;
  }

  findAll() {
    return `This action returns all advertisingSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} advertisingSchedule`;
  }

  update(
    id: number,
    updateAdvertisingScheduleDto: UpdateAdvertisingScheduleDto,
  ) {
    return `This action updates a #${id} advertisingSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} advertisingSchedule`;
  }
}
