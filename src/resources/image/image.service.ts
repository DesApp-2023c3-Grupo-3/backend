import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from 'cartelera-unahur';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from 'src/entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    public readonly imageRepository: Repository<Image>,
  ) {}

  public async create(file: Express.Multer.File) {
    const newImage = this.imageRepository.create({
      originalName: file.originalname,
      path: file.path, // TODO: Agregar esto a la entidad
      // path: `${file.path}.${file.mimetype.split('/')[1]}` // TODO: Agregar esto a la entidad
    });
    const created = await this.imageRepository.save(newImage);
    return created;
  }

  public async findOne(id: number) {
    try {
      const imageFound = this.imageRepository.find({ where: { id } });
      // TODO: Obtener la imagen desde la carpeta public que tenga como nombre imageFound.path
      // TODO: Devolver la imagen encontrada
      return imageFound;
    } catch (error) {
      throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
    }
  }
}
