import { Injectable } from '@nestjs/common';
import { CreateImageScreenDto } from './dto/create-image-screen.dto';
import { UpdateImageScreenDto } from './dto/update-image-screen.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageScreen } from 'src/entities/image-screen.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageScreenService {
  constructor(
    @InjectRepository(ImageScreen)
    private imageScreenRepository: Repository<ImageScreen>,
  ) {}

  create(createImageScreenDto: CreateImageScreenDto) {
    return this.imageScreenRepository.save(createImageScreenDto);
  }

  findAll() {
    return this.imageScreenRepository.find();
  }

  findOne(id: number) {
    return this.imageScreenRepository.findOneByOrFail({ id });
  }

  update(id: number, updateImageScreenDto: UpdateImageScreenDto) {
    return this.imageScreenRepository.update({ id }, updateImageScreenDto);
  }

  remove(id: number) {
    return this.imageScreenRepository.delete({ id });
  }
}
