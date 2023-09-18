import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Image } from 'src/entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    public readonly imageRepository: Repository<Image>,
  ) {}

  public async create(file: Express.Multer.File) {
    const newImage = this.imageRepository.create({
      originalName: file.originalname,
      path: file.path,
    });
    const created = await this.imageRepository.save(newImage);
    return created;
  }

  findByIdAndArchivoNotIsNull(id: number) {
    return this.imageRepository.findOneOrFail({
      select: ['originalName', 'path'],
      where: { id, originalName: Not(IsNull()) },
    });
  }
}
