import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSectorDto, UpdateSectorDto } from 'cartelera-unahur';
import { Sector } from 'src/entities/sector.entity';
import { SocketService } from 'src/plugins/socket/socket.service';
import { Repository } from 'typeorm';

@Injectable()
export class SectorService {
  constructor(
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
    private readonly socketService: SocketService,
  ) {}

  public async create(createSectorDto: CreateSectorDto) {
    console.log(createSectorDto);
    const newSector = this.sectorRepository.create(createSectorDto);
    const created = await this.sectorRepository.save(newSector);
    this.socketService.sendMessage(
      'Sector',
      'Este es un mensaje enviado desde SectorService.create',
    );
    return created;
  }

  public async findAll() {
    return this.sectorRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.sectorRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('Sector not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateSectorDto: UpdateSectorDto) {
    try {
      return this.sectorRepository.update({ id }, updateSectorDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.sectorRepository.update(
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
