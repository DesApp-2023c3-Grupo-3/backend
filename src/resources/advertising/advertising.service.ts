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
    this.socketService.sendMessage('advertising', {
      id: 1,
      advertisingTypeId: 1,
      title: 'aviso default',
      payload: 'url default',
    });
    return created;
  }

  public async findAll() {
    return this.advertisingRepository.find();
  }

  public async findAllRole(roleId: number) {
    const avisos = await this.advertisingRepository.find({
      relations: ['user', 'user.role', 'advertisingType', 'schedule', 'sector'],
    });
    const filtradoPorRol = avisos.filter((aviso) => {
      return aviso.user.role && aviso.user.role.id == roleId;
    });
    return filtradoPorRol;
  }

  public async findOne(id: number) {
    try {
      return this.advertisingRepository.find({
        relations: [
          'user',
          'user.role',
          'advertisingType',
          'schedule',
          'sector',
        ],
        where: { id },
      });
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
