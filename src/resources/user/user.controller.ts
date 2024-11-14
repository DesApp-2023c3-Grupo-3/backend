import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  ResponseAdvertisingDto,
  ResponseUserDto,
  UpdateUserDto,
} from 'cartelera-unahur';
import { Unprotected } from 'nest-keycloak-connect';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Unprotected()
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

  @Get('all/')
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    description: 'Número de la página',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Número de registros por página',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Busca los cursos por nombre',
  })
  @ApiResponse({ type: ResponseAdvertisingDto, isArray: true })
  async findPageAndLimit(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    return this.userService.findPageAndLimit(page, limit, search);
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
