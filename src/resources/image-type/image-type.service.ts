import { Injectable } from '@nestjs/common';
import { CreateImageTypeDto, UpdateImageTypeDto } from 'cartelera-unahur';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageType } from 'src/entities/image-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageTypeService {
  constructor(
    @InjectRepository(ImageType)
    private imageTypeRepository: Repository<ImageType>,
  ) {}

  create(createImageTypeDto: CreateImageTypeDto) {
    return this.imageTypeRepository.save(createImageTypeDto);
  }

  findAll() {
    return this.imageTypeRepository.find();
  }

  findOne(id: number) {
    return this.imageTypeRepository.findOneByOrFail({ id });
  }

  update(id: number, updateImageTypeDto: UpdateImageTypeDto) {
    return this.imageTypeRepository.update({ id }, updateImageTypeDto);
  }

  remove(id: number) {
    return this.imageTypeRepository.delete({ id });
  }
}
