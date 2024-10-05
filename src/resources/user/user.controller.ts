import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  ResponseUserDto,
  UpdateUserDto,
} from 'cartelera-unahur';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({ type: ResponseUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiResponse({ type: ResponseUserDto, isArray: true })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: ResponseUserDto })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('keycloak/:sub')
  @ApiResponse({ type: ResponseUserDto })
  findByIdKeycloak(@Param('sub') sub: string) {
    return this.userService.findByIdKeycloak(sub);
  }

  @Patch(':id')
  @ApiResponse({ type: ResponseUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ type: ResponseUserDto })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
