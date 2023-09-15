import { Injectable } from '@nestjs/common';
import { CreateCourseScreenDto, UpdateCourseScreenDto } from 'cartelera-unahur';

@Injectable()
export class CourseScreenService {
  create(createCourseScreenDto: CreateCourseScreenDto) {
    return 'This action adds a new courseScreen';
  }

  findAll() {
    return `This action returns all courseScreen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courseScreen`;
  }

  update(id: number, updateCourseScreenDto: UpdateCourseScreenDto) {
    return `This action updates a #${id} courseScreen`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseScreen`;
  }
}
