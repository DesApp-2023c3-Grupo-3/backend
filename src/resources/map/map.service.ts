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
    if (createEntityDto.estaSeleccionado) {
      await this.findMapSelected();
    }
    const newImage = this.mapRepository.create({
      originalName: file.originalname,
      base64Data: uploadFile.toString('base64'),
      estaSeleccionado: true,
      name: createEntityDto.name,
    });
    const createImage = await this.mapRepository.save(newImage);
    const { id, originalName, name, estaSeleccionado } = createImage;
    return { id, originalName, name, estaSeleccionado };
  }

  async update(
    id: number,
    updateEntityDto: MapDto,
    file?: Express.Multer.File,
  ) {
    if (updateEntityDto.estaSeleccionado) {
      await this.findMapSelected();
    }
    const findMap = await this.mapRepository.findOneBy({ id });
    if (!findMap) {
      throw new Error('Entidad no encontrada');
    }
    if (file) {
      const uploadFile = await this.imageService.uploadImage(file);
      if (!uploadFile) {
        throw new Error('Error al subir la imagen');
      }
      findMap.originalName = file.originalname;
      findMap.base64Data = uploadFile.toString('base64');
    }
    findMap.name = updateEntityDto.name;
    findMap.estaSeleccionado = updateEntityDto.estaSeleccionado;
    const updatedImage = await this.mapRepository.save(findMap);
    const {
      id: updatedId,
      originalName,
      name,
      estaSeleccionado,
    } = updatedImage;
    return { updatedId, originalName, name, estaSeleccionado };
  }

  async findMapSelected() {
    const maps = await this.mapRepository.find({
      where: { estaSeleccionado: true },
    });
    const updatedMaps = maps.map((map) => {
      map.estaSeleccionado = false;
      return map;
    });
    await this.mapRepository.save(updatedMaps);
    return updatedMaps;
  }
  async findByIdAndArchivoNotIsNull(id: number): Promise<Image> {
    return this.mapRepository.findOneOrFail({
      select: ['originalName', 'base64Data'],
      where: { id, originalName: Not(IsNull()) },
    });
  }
  async findByActiveAndArchivoNotIsNull(): Promise<Image> {
    return this.mapRepository.findOneOrFail({
      select: ['originalName', 'base64Data'],
      where: { estaSeleccionado: true, originalName: Not(IsNull()) },
    });
  }

  findAll() {
    return this.mapRepository.find({
      where: { deletedAt: IsNull() },
      select: {
        name: true,
        id: true,
        originalName: true,
        estaSeleccionado: true,
      },
      order: { id: 'DESC' },
    });
  }

  remove(id: number) {
    return this.mapRepository.update({ id }, { id, deletedAt: new Date() });
  }
}
