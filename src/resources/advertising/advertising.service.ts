import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateImageDto, UpdateImageDto } from 'cartelera-unahur';
import { SocketService } from '../../plugins/socket/socket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Advertising } from '../../entities/advertising.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdvertisingService {
  constructor(
    @InjectRepository(Advertising)
    private readonly advertisingRepository: Repository<Advertising>,
    private readonly socketService: SocketService,
  ) {}

  public async create(createImageDto: CreateImageDto) {
    console.log(createImageDto);
    const newImage = this.advertisingRepository.create(createImageDto);
    const created = await this.advertisingRepository.save(newImage);
    this.socketService.sendMessage(
      'image',
      'Este es un mensaje enviado desde ImageService.create',
    );
    return created;
  }

  public async findAll() {
    return this.advertisingRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.advertisingRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateImageDto: UpdateImageDto) {
    try {
      return this.advertisingRepository.update({ id }, updateImageDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.advertisingRepository.update(
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
