import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSectorDto, UpdateSectorDto } from 'cartelera-unahur';
import { Sector } from 'src/entities/sector.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SectorService {
  constructor(
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
  ) {}

  public async create(createSectorDto: CreateSectorDto) {
    const newSector = this.sectorRepository.create(createSectorDto);
    const created = await this.sectorRepository.save(newSector);
    return created;
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

  public async createSectores(sectors: string[]) {
    const sectoresCojunto = new Set(sectors);
    const sectores = Array.from(sectoresCojunto);
    const sectoresActuales = await this.findAll();
    const nuevosSectores = sectores.filter((sector) => {
      return !sectoresActuales.some(
        (sectorViejo) => sector === sectorViejo.name,
      );
    });
    nuevosSectores.forEach((sector) => {
      this.create({
        name: sector,
        topic: null,
      });
    });
    console.log('Nuevos: ', nuevosSectores);
  }
}
