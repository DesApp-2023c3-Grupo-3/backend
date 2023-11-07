import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CourseScreenService } from './course-screen.service';
import { CreateCourseScreenDto, UpdateCourseScreenDto } from 'cartelera-unahur';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('course-screen')
export class CourseScreenController {
  constructor(private readonly courseScreenService: CourseScreenService) {}

  @Post()
  create(@Body() createCourseScreenDto: CreateCourseScreenDto) {
    return this.courseScreenService.create(createCourseScreenDto);
  }

  @Get()
  findAll() {
    return this.courseScreenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseScreenService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseScreenDto: UpdateCourseScreenDto,
  ) {
    return this.courseScreenService.update(+id, updateCourseScreenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseScreenService.remove(+id);
  }
}
