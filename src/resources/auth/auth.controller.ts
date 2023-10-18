import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'cartelera-unahur';
import { Public } from 'src/common/guards/SetMetadata';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  registerUser(@Body() registerUser: CreateUserDto) {
    return this.authService.registerUser(registerUser);
  }

  @Public()
  @Post('/login')
  loginUser(@Body() loginUser: LoginUserDto) {
    return this.authService.loginUser(loginUser);
  }
}
