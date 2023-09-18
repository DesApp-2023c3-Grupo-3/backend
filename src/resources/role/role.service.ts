import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from 'cartelera-unahur';
import { Role } from 'src/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  public async create(createRoleDto: CreateRoleDto) {
    console.log(createRoleDto);
    const newRole = this.roleRepository.create(createRoleDto);
    const created = await this.roleRepository.save(newRole);
    return created;
  }

  public async findAll() {
    return this.roleRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.roleRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      return this.roleRepository.update({ id }, updateRoleDto);
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.roleRepository.update(
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
