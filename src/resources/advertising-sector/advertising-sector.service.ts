import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AdvertisingSector } from 'src/entities/advertising-sector.entity';
// import {
//   CreateAdvertisingSectorDto,
//   UpdateAdvertisingSectorDto,
// } from 'cartelera-unahur'; // TODO: fixear y descomentar

@Injectable()
export class AdvertisingSectorService {
  constructor(
    @InjectRepository(AdvertisingSector)
    private readonly advertisingSector: Repository<AdvertisingSector>,
  ) {}
  public async create(
    createAdvertisingSectorDto /* : CreateAdvertisingSectorDto */, // TODO: fixear y descomentar
  ) {
    const newAdvertisingSector = this.advertisingSector.create(
      createAdvertisingSectorDto,
    );
    const created = await this.advertisingSector.save(newAdvertisingSector);
    return created;
  }

  findAll() {
    return `This action returns all advertisingSector`;
  }

  findOne(id: number) {
    return `This action returns a #${id} advertisingSector`;
  }

  update(
    id: number,
    updateAdvertisingSectorDto /* : UpdateAdvertisingSectorDto */, // TODO: fixear y descomentar
  ) {
    return `This action updates a #${id} advertisingSector`;
  }

  remove(id: number) {
    return `This action removes a #${id} advertisingSector`;
  }

  public async removeMultiple(ids: number[]) {
    try {
      return this.advertisingSector.update(
        { id: In(ids) },
        {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      );
    } catch (error) {}
  }
}
