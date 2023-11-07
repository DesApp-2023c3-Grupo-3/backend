import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, RoleDto, UpdateRoleDto } from 'cartelera-unahur';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiResponse({ type: RoleDto })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiResponse({ type: RoleDto, isArray: true })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: RoleDto })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: RoleDto })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiResponse({ type: RoleDto })
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
