import { Injectable, Inject } from '@nestjs/common';
import { MapDto } from './dto/map.dto';
import { ImageService } from '../image/image.service';
import { Map } from 'src/entities/map.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Image } from '../../entities/image.entity';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Map)
    private readonly mapRepository: Repository<Map>,
    @Inject(ImageService)
    private readonly imageService: ImageService,
  ) {}
  async create(file: Express.Multer.File, createEntityDto: MapDto) {
    const uploadFile = await this.imageService.uploadImage(file);
    const newImage = this.mapRepository.create({
      originalName: file.originalname,
      base64Data: uploadFile.toString('base64'),
      name: createEntityDto.name,
    });
    console.log(newImage);
    const createImage = await this.mapRepository.save(newImage);
    const { id, originalName, name } = createImage;
    return { id, originalName, name };
  }

  async findByIdAndArchivoNotIsNull(id: number): Promise<Image> {
    return this.mapRepository.findOneOrFail({
      select: ['originalName', 'base64Data'],
      where: { id, originalName: Not(IsNull()) },
    });
  }

  findAll() {
    return this.mapRepository.find({
      where: { deletedAt: IsNull() },
      select: { name: true, id: true, originalName: true },
      order: { id: 'DESC' },
    });
  }

  remove(id: number) {
    return this.mapRepository.update({ id }, { id, deletedAt: new Date() });
  }
}
