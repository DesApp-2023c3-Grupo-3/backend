import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateScreenDto, UpdateScreenDto } from 'cartelera-unahur';
import { Screen } from 'src/entities/screen.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScreenService {
  constructor(
    @InjectRepository(Screen)
    private readonly screenRepository: Repository<Screen>,
  ) {}

  async create(createScreenDto: CreateScreenDto) {
    const newScreen = this.screenRepository.create(createScreenDto);
    const created = await this.screenRepository.save(newScreen);
    return created;
  }

  async findAll() {
    return this.screenRepository.find();
  }

  async findOne(id: number): Promise<Screen> {
    try {
      const [response] = await this.screenRepository.find({ where: { id } });
      return response;
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateScreenDto: UpdateScreenDto) {
    return this.screenRepository.update({ id }, updateScreenDto);
  }

  public async remove(id: number) {
    try {
      return this.screenRepository.update(
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
