import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { CreateUserDto } from 'cartelera-unahur';
import { UserService } from 'src/resources/user/user.service';
@Injectable()
export class AuthService {
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async registerUser(createAuthDto: CreateUserDto) {
    const { password } = createAuthDto;
    const plainToHash = await hash(password, 12);
    createAuthDto = { ...createAuthDto, password: plainToHash };
    return await this.userService.create(createAuthDto);
  }

  async loginUser(userAuthDto: CreateUserDto) {
    const { dni, password } = userAuthDto;
    const findUser = await this.userService.findUserDni(dni);
    if (!findUser) throw new HttpException('User not found', 404);
    const checkPassword = await compare(password, findUser.password);
    if (!checkPassword) throw new HttpException('Incorrect password', 403);
    const payload = {
      id: findUser.id,
      name: findUser.name,
      role: findUser.role,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'a1b2c3d4',
    });
    return { token: token };
  }
}
