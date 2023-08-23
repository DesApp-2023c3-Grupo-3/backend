import { Injectable } from '@nestjs/common';
import { CreateImageTypeDto } from './dto/create-image-type.dto';
import { UpdateImageTypeDto } from './dto/update-image-type.dto';

@Injectable()
export class ImageTypeService {
  create(createImageTypeDto: CreateImageTypeDto) {
    return 'This action adds a new imageType';
  }

  findAll() {
    return `This action returns all imageType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageType`;
  }

  update(id: number, updateImageTypeDto: UpdateImageTypeDto) {
    return `This action updates a #${id} imageType`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageType`;
  }
}
