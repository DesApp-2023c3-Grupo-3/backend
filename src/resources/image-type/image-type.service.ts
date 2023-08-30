import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateImageTypeDto } from './dto/create-image-type.dto';
import { UpdateImageTypeDto } from './dto/update-image-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageType } from 'src/entities/image-type.entity';
import { Repository } from 'typeorm';
import { SocketService } from 'src/plugins/socket/socket.service';

@Injectable()
export class ImageTypeService {
  constructor(
    @InjectRepository(ImageType)
    private readonly imageTypeRepository: Repository<ImageType>,
    private readonly socketService: SocketService,
  ) {}

  public async create(createImageTypeDto: CreateImageTypeDto) {
    const newImage = this.imageTypeRepository.create(createImageTypeDto);
    const created = await this.imageTypeRepository.save(newImage);
    this.socketService.sendMessage(
      'imageType',
      'Este es un mensaje enviado desde ImageTypeService.create',
    );
    return created;
  }

  public async findAll() {
    return this.imageTypeRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.imageTypeRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('ImageType not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateImageTypeDto: UpdateImageTypeDto) {
    try {
      return this.imageTypeRepository.update({ id }, updateImageTypeDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.imageTypeRepository.update(
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
