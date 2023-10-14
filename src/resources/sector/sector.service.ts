import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSectorDto, UpdateSectorDto } from 'cartelera-unahur';
import { Sector } from 'src/entities/sector.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class SectorService {
  constructor(
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
  ) {}

  public createEntity(createSectorDto: CreateSectorDto): Sector {
    return this.sectorRepository.create(createSectorDto);
  }

  public async create(createSectorDto: CreateSectorDto) {
    const newSector = this.sectorRepository.create(createSectorDto);
    const created = await this.sectorRepository.save(newSector);
    return created;
  }

  public async createMultiple(createSectorDto: CreateSectorDto[]) {
    const sectorToCreate = createSectorDto.map((createSectorDto) =>
      this.sectorRepository.create(createSectorDto),
    );
    return this.sectorRepository.save(sectorToCreate);
  }

  public async findAll() {
    return this.sectorRepository.find();
  }

  public async findOne(id: number): Promise<Sector> {
    try {
      return this.sectorRepository.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException('Sector not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async findSectorsNotInArray(sectorNames: string[]) {
    return await this.sectorRepository.find({
      where: {
        name: In(sectorNames),
      },
    });
  }

  public async findByIds(ids: number[]): Promise<Sector[]> {
    try {
      return this.sectorRepository.find({ where: { id: In(ids) } });
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
