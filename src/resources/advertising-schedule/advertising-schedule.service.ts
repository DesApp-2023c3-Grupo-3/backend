import { Injectable } from '@nestjs/common';
import { CreateAdvertisingScheduleDto } from './dto/create-advertising-schedule.dto';
import { UpdateAdvertisingScheduleDto } from './dto/update-advertising-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdvertisingSchedule } from 'src/entities/advertising-schedule.entity';

@Injectable()
export class AdvertisingScheduleService {
  constructor(
    @InjectRepository(AdvertisingSchedule)
    private readonly advertisingSchedule: Repository<AdvertisingSchedule>,
  ) {}
  create(createAdvertisingScheduleDto: CreateAdvertisingScheduleDto) {
    return 'This action adds a new advertisingSchedule';
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
