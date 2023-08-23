import { Injectable } from '@nestjs/common';
import { CreateImageScreenDto } from './dto/create-image-screen.dto';
import { UpdateImageScreenDto } from './dto/update-image-screen.dto';

@Injectable()
export class ImageScreenService {
  create(createImageScreenDto: CreateImageScreenDto) {
    return 'This action adds a new imageScreen';
  }

  findAll() {
    return `This action returns all imageScreen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageScreen`;
  }

  update(id: number, updateImageScreenDto: UpdateImageScreenDto) {
    return `This action updates a #${id} imageScreen`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageScreen`;
  }
}
