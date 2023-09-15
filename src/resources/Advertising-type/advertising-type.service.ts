import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateAdvertisingTypeDto,
  UpdateAdvertisingTypeDto,
} from 'cartelera-unahur';
import { AdvertisingType } from 'src/entities/advertising-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdvertisingTypeService {
  constructor(
    @InjectRepository(AdvertisingType)
    private readonly advertisingTypeRepository: Repository<AdvertisingType>,
  ) {}

  public async create(createAdvertisingTypeDto: CreateAdvertisingTypeDto) {
    const newImage = this.advertisingTypeRepository.create(
      createAdvertisingTypeDto,
    );
    const created = await this.advertisingTypeRepository.save(newImage);
    return created;
  }

  public async findAll() {
    return this.advertisingTypeRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.advertisingTypeRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('ImageType not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(
    id: number,
    updateAdvertisingTypeDto: UpdateAdvertisingTypeDto,
  ) {
    try {
      return this.advertisingTypeRepository.update(
        { id },
        updateAdvertisingTypeDto,
      );
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.advertisingTypeRepository.update(
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
