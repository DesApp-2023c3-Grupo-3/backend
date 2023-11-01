import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { CreateUserDto, LoginUserDto } from 'cartelera-unahur';
import { UserService } from 'src/resources/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(createAuthDto: CreateUserDto) {
    const { password } = createAuthDto;
    const plainToHash = await hash(password, 12);
    createAuthDto = { ...createAuthDto, password: plainToHash };
    return this.userService.create(createAuthDto);
  }

  async loginUser(userAuthDto: LoginUserDto) {
    const { dni, password } = userAuthDto;
    const userFound = await this.userService.getUserByDni(dni);
    if (!userFound) {
      throw new HttpException('User not found', 400);
    }
    const passwordChecker = await compare(password, userFound.password);
    if (!passwordChecker) {
      throw new HttpException('Incorrect password', 400);
    }
    const payload = {
      id: userFound.id,
      name: userFound.name,
      role: userFound.role,
    };
    const accessToken = this.jwtService.sign(
      { payload },
      {
        secret: process.env.JWT_ACCESS_SECRET || 'a1b2c3d4',
        expiresIn: '1h',
      },
    );
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || '12',
      expiresIn: '24h',
    });
    return { accessToken, refreshToken };
  }

  refreshAccessToken(refreshToken: string) {
    if (this.validateRefreshToken(refreshToken)) {
      const payload = this.jwtService.decode(refreshToken);
      if (payload) {
        const accessToken = this.jwtService.sign(
          { payload },
          {
            secret: process.env.JWT_ACCESS_SECRET || 'a1b2c3d4',
            expiresIn: '1h',
          },
        );
        return accessToken;
      }
    }
    throw new HttpException('Invalid refresh token', 400);
  }

  validateRefreshToken(refreshToken: string) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || '12',
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
