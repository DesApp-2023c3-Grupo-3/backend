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

  async create(createScreenDto: CreateScreenDto): Promise<Screen> {
    const newScreen = this.screenRepository.create({ subscription: 'asd' });
    const created = await this.screenRepository.save(newScreen);
    return created;
  }

  async findAll() {
    return `This action returns all screen`;
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
    return `This action updates a #${id} screen`;
  }

  async remove(id: number) {
    return `This action removes a #${id} screen`;
  }
}
