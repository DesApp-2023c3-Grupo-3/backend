import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import {
  ClassroomDto,
  CreateClassroomDto,
  UpdateClassroomDto,
} from 'cartelera-unahur';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Classroom')
@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  @ApiResponse({ type: CreateClassroomDto })
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.create(createClassroomDto);
  }

  @Get()
  @ApiResponse({ type: ClassroomDto, isArray: true })
  findAll() {
    return this.classroomService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: ClassroomDto })
  findOne(@Param('id') id: string) {
    return this.classroomService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: ClassroomDto })
  update(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomService.update(+id, updateClassroomDto);
  }

  @Delete(':id')
  @ApiResponse({ type: ClassroomDto })
  remove(@Param('id') id: string) {
    return this.classroomService.remove(+id);
  }
}
