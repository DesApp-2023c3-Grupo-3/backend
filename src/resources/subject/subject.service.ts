import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubjectDto, UpdateSubjectDto } from 'cartelera-unahur';
import { Subject } from 'src/entities/subject.entity';
import { SocketService } from 'src/plugins/socket/socket.service';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    private readonly socketService: SocketService,
  ) {}

  public async create(createSubjectDto: CreateSubjectDto) {
    console.log(createSubjectDto);
    const newSubject = this.subjectRepository.create(createSubjectDto);
    const created = await this.subjectRepository.save(newSubject);
    this.socketService.sendMessage(
      'Subject',
      'Este es un mensaje enviado desde SubjectService.create',
    );
    return created;
  }

  public async findAll() {
    return this.subjectRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.subjectRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('Subject not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    try {
      return this.subjectRepository.update({ id }, updateSubjectDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.subjectRepository.update(
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
