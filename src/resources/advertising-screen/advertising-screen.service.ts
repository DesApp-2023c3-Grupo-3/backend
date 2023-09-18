import { Injectable } from '@nestjs/common';
import {
  CreateAdvertisingScreenDto,
  UpdateAdvertisingScreenDto,
} from 'cartelera-unahur';

@Injectable()
export class AdvertisingScreenService {
  create(createAdvertisingScreenDto: CreateAdvertisingScreenDto) {
    return 'This action adds a new imageScreen';
  }

  findAll() {
    return `This action returns all imageScreen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageScreen`;
  }

  update(id: number, updateAdvertisingScreenDto: UpdateAdvertisingScreenDto) {
    return `This action updates a #${id} imageScreen`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageScreen`;
  }
}
