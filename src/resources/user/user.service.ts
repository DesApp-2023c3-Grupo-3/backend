import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'cartelera-unahur';
import { User } from 'src/entities/user.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    const { dni } = newUser;
    const userFound = await this.getUserByDni(dni);
    if (!userFound) {
      return await this.userRepository.save(newUser);
    } else {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
  }

  public async findAll() {
    return this.userRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.userRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async getUserByDni(dni: string) {
    try {
      return this.userRepository.findOne({
        where: { dni, deletedAt: IsNull() },
        relations: { role: true },
      });
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return this.userRepository.update({ id }, updateUserDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.userRepository.update(
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
