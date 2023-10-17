import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'cartelera-unahur';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  registerUser(@Body() registerUser: CreateUserDto) {
    return this.authService.registerUser(registerUser);
  }

  @Post('/login')
  loginUser(@Body() loginUser: CreateUserDto) {
    return this.authService.loginUser(loginUser);
  }
}
