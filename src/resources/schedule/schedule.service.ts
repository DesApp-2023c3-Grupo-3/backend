import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateScheduleDto, UpdateScheduleDto } from 'cartelera-unahur';
import { Schedule } from 'src/entities/schedule.entity';
import { SocketService } from 'src/plugins/socket/socket.service';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly socketService: SocketService,
  ) {}

  public async create(createScheduleDto: CreateScheduleDto) {
    console.log(createScheduleDto);
    const newSchedule = this.scheduleRepository.create(createScheduleDto);
    const created = await this.scheduleRepository.save(newSchedule);
    this.socketService.sendMessage(
      'Schedule',
      'Este es un mensaje enviado desde ScheduleService.create',
    );
    return created;
  }

  public async findAll() {
    return this.scheduleRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.scheduleRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    try {
      return this.scheduleRepository.update({ id }, updateScheduleDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.scheduleRepository.update(
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
