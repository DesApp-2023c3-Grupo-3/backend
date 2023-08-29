import { Injectable } from '@nestjs/common';
import { CreateImageDto, UpdateImageDto } from 'cartelera-unahur';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';

import { SocketService } from 'src/plugins/socket/socket.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  create(createImageDto: CreateImageDto) {
    this.socketService.sendMessage('image', 'Este es un mensaje enviado desde ImageService.create')
    return this.imageRepository.create(createImageDto);
    private readonly socketService: SocketService,
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
