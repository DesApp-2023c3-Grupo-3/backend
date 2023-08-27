import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  create(createImageDto: CreateImageDto) {
    return this.imageRepository.create(createImageDto);
  }

  findAll() {
    return this.imageRepository.find();
  }

  findOne(id: number) {
    return this.imageRepository.findOneByOrFail({ id });
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return this.imageRepository.update({ id }, updateImageDto);
  }

  remove(id: number) {
    return this.imageRepository.delete({ id });
  }
}
