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
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { Res } from '@nestjs/common';
import { Response } from 'express';
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

  @Get('/download-template')
  async downloadTemplete(
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    try {
      const excelBuffer = await this.courseService.createCommissionTemplate();
      const excelBufferStream = new StreamableFile(excelBuffer);

      res.setHeader(
        'Content-Disposition',
        `attachment; filename=commission-template.xlsx`,
      );
      res.setHeader(
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
    return this.courseService.findTodayCoursesBySector(sectorId);
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
        startDate: {
          type: 'string',
          format: 'date-time',
          example: new Date(),
        },
        endDate: {
          type: 'string',
          format: 'date-time',
          example: new Date(),
        },
        sector: {
          $ref: 'string',
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
  @Post('/upload')
  async createExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { startDate: string; endDate: string; sector: string },
  ) {
    return this.courseService.uploadCommission(
      file,
      data.startDate,
      data.endDate,
      Number(data.sector),
    );
  }
}
