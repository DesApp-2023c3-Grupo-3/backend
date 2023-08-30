import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateImageDto, UpdateImageDto } from 'cartelera-unahur';

import { SocketService } from 'src/plugins/socket/socket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly socketService: SocketService,
  ) {}

  public async create(createImageDto: CreateImageDto) {
    console.log(createImageDto);
    const newImage = this.imageRepository.create(createImageDto);
    const created = await this.imageRepository.save(newImage);
    this.socketService.sendMessage(
      'image',
      'Este es un mensaje enviado desde ImageService.create',
    );
    return created;
  }

  public async findAll() {
    return this.imageRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.imageRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateImageDto: UpdateImageDto) {
    try {
      return this.imageRepository.update({ id }, updateImageDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.imageRepository.update(
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
