import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

import { NatsService } from 'src/plugins/nats/nats.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly natsService: NatsService,
  ) { }

  create(createImageDto: CreateImageDto) {
    this.natsService.sendMessage('image', 'Este es un mensaje enviado desde ImageService.create')
    return 'This action adds a new image';
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
