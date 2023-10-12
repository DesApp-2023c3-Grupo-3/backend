import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  StreamableFile,
} from '@nestjs/common';
import { CourseService } from './course.service';
import {
  CourseDto,
  CreateCourseDto,
  UpdateCourseDto,
  ResponseCourseDto,
} from 'cartelera-unahur';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiResponse({ type: CourseDto })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get('download-template')
  async downloadTemplete(
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    try {
      const excelBuffer = await this.courseService.createCommissionTemplate();
      const excelBufferStream = new StreamableFile(excelBuffer);

      response.setHeader(
        'Content-Disposition',
        `attachment; filename=commission-template.xlsx`,
      );
      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );

      return excelBufferStream;
    } catch (error) {
      throw new HttpException(
        'Commission template not found',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiResponse({ type: ResponseCourseDto, isArray: true })
  findAll() {
    return this.courseService.findAll();
  }

  @Get('sector/:sectorId')
  @ApiResponse({ type: ResponseCourseDto, isArray: true })
  findBySector(@Param('sectorId') sectorId: number) {
    return this.courseService.findBySector(sectorId);
  }

  @Get(':id')
  @ApiResponse({ type: ResponseCourseDto })
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: CourseDto })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  @ApiResponse({ type: CourseDto })
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
