import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdvertisingType } from 'src/entities/advertising-type.entity';
import { Repository } from 'typeorm';
import { SocketService } from 'src/plugins/socket/socket.service';
import { CreateImageTypeDto, UpdateImageTypeDto } from 'cartelera-unahur';

@Injectable()
export class AdvertisingTypeService {
  constructor(
    @InjectRepository(AdvertisingType)
    private readonly advertisingTypeRepository: Repository<AdvertisingType>,
  ) {}

  public async create(createImageTypeDto: CreateImageTypeDto) {
    const newImage = this.advertisingTypeRepository.create(createImageTypeDto);
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

  public async update(id: number, updateImageTypeDto: UpdateImageTypeDto) {
    try {
      return this.advertisingTypeRepository.update({ id }, updateImageTypeDto);
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
