import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClassroomDto, UpdateClassroomDto } from 'cartelera-unahur';
import { Classroom } from 'src/entities/classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketService } from 'src/plugins/socket/socket.service';
import { Repository } from 'typeorm';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
    private readonly socketService: SocketService,
  ) {}

  public async create(createClassroomDto: CreateClassroomDto) {
    console.log(createClassroomDto);
    const newClassroom = this.classroomRepository.create(createClassroomDto);
    const created = await this.classroomRepository.save(newClassroom);
    this.socketService.sendMessage(
      'Classroom',
      'Este es un mensaje enviado desde ClassroomService.create',
    );
    return created;
  }

  public async findAll() {
    return this.classroomRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.classroomRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('Classroom not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateClassroomDto: UpdateClassroomDto) {
    try {
      return this.classroomRepository.update({ id }, updateClassroomDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.classroomRepository.update(
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
