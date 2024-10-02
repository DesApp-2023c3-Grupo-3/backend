import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'cartelera-unahur';
import { User } from 'src/entities/user.entity';
import { Brackets, IsNull, Repository } from 'typeorm';
import { hash } from 'bcrypt';
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
      return this.userRepository.save(newUser);
    } else {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
  }

  public async findAll() {
    return this.userRepository.find({
      where: { deletedAt: IsNull() },
      relations: { role: true },
      order: { id: 'DESC' },
    });
  }

  public async findPageAndLimit(page: number, limit: number, search = '') {
    const offset = (page - 1) * limit;
    const applySearchFilter = (qb) => {
      if (search.length > 1) {
        qb.andWhere(
          new Brackets((qb2) => {
            qb2
              .where('LOWER(u."name") LIKE LOWER(:searchTerm)', {
                searchTerm: `%${search}%`,
              })
              .orWhere('LOWER(u."dni") LIKE LOWER(:searchTerm)', {
                searchTerm: `%${search}%`,
              })
              .orWhere('LOWER(rl."name") LIKE LOWER(:searchTerm)', {
                searchTerm: `%${search}%`,
              });
          }),
        );
      }
    };
    const query = this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.*',
        `jsonb_build_object(
           'id', rl.id,
           'name', rl."name"
         ) AS "role"`,
      ])
      .innerJoin('Role', 'rl', 'rl.id = u."roleId"')
      .where('u."deletedAt" IS NULL')
      .offset(offset)
      .limit(limit);

    applySearchFilter(query);

    const data = await query.getRawMany();
    const totalQuery = this.userRepository
      .createQueryBuilder('u')
      .select('COUNT(*)', 'count')
      .innerJoin('Role', 'rl', 'rl.id = u."roleId"')
      .where('u."deletedAt" IS NULL');

    applySearchFilter(totalQuery);

    const totalResult = await totalQuery.getRawOne();
    const total = parseInt(totalResult.count, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      total,
      limit,
      totalPages,
    };
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
    const { password } = updateUserDto;
    const plainToHash = await hash(password, 12);
    updateUserDto = { ...updateUserDto, password: plainToHash };
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
          deletedAt: new Date(),
        },
      );
    } catch (error) {
      throw new HttpException('Error on delete', HttpStatus.BAD_REQUEST);
    }
  }
}
