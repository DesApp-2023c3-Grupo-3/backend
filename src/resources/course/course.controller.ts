import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CourseService } from './course.service';
import {
  CourseDto,
  CreateCourseDto,
  UpdateCourseDto,
  ResponseCourseDto,
} from 'cartelera-unahur';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiResponse({ type: CourseDto })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
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

  @Post('commissionTemplate')
  async commissionTemplate(@Res() res: Response) {
    try {
      const excelBuffer = await this.courseService.createCommissionTemplate();

      res.setHeader(
        'Content-Disposition',
        `attachment; filename=commission-template.xlsx`,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );

      res.send(excelBuffer);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al crear el archivo Excel.',
        error: error.message,
      });
    }
  }

  @ApiOperation({
    summary: 'Carga al servidor un archivo excel y sube las comisiones',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('file'))
  @Post('excel-to-json')
  async createExcel(@UploadedFile() file: Express.Multer.File) {
    return this.courseService.uploadCommission(file);
  }
}
