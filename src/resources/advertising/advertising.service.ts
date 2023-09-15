import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SocketService } from '../../plugins/socket/socket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Advertising } from '../../entities/advertising.entity';
import { Repository } from 'typeorm';
import { CreateAdvertisingDto, UpdateAdvertisingDto } from 'cartelera-unahur';

@Injectable()
export class AdvertisingService {
  constructor(
    @InjectRepository(Advertising)
    private readonly advertisingRepository: Repository<Advertising>,
    private readonly socketService: SocketService,
  ) {}

  public async create(createAdvertisingDto: CreateAdvertisingDto) {
    console.log(createAdvertisingDto);
    const newAdvertising =
      this.advertisingRepository.create(createAdvertisingDto);
    const created = await this.advertisingRepository.save(newAdvertising);
    this.socketService.sendMessage(
      'Advertising',
      'Este es un mensaje enviado desde AdvertisingService.create',
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

  public async update(id: number, updateAdvertisingDto: UpdateAdvertisingDto) {
    try {
      return this.advertisingRepository.update({ id }, updateAdvertisingDto);
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
