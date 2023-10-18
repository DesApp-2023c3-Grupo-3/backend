import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  ResponseUserDto,
  UpdateUserDto,
} from 'cartelera-unahur';
import { JwtAuthGuard } from '../../common/guardias/jwt-auth.guard';
import { Public } from 'src/common/guardias/SetMetadata';

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

  @Public()
  @Get()
  @ApiResponse({ type: ResponseUserDto, isArray: true })
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({ type: ResponseUserDto })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiResponse({ type: ResponseUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({ type: ResponseUserDto })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
