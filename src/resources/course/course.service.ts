import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

import { SocketService } from 'src/plugins/socket/socket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly natsService: SocketService,
  ) {}

  public async create(createCourseDto: CreateCourseDto) {
    const newCourse = this.courseRepository.create(createCourseDto);
    const created = await this.courseRepository.save(newCourse);
    this.natsService.sendMessage(
      'course',
      'Este es un mensaje enviado desde CourseService.create',
    );
    return created;
  }

  public async findAll() {
    return this.courseRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.courseRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('Course not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateCourseDto: UpdateCourseDto) {
    try {
      return this.courseRepository.update({ id }, updateCourseDto); // TODO: Revisar el output del update
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.courseRepository.update(
        { id },
        {
          id,
          deletedAt: Date.now(), // TODO: Probar el borrado logico de @DeletedAtColumn
        },
      );
    } catch (error) {
      throw new HttpException('Error on delete', HttpStatus.BAD_REQUEST);
    }
  }
}
