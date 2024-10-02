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
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import {
  CourseDto,
  CreateCourseDto,
  UpdateCourseDto,
  ResponseCourseDto,
  ResponseAdvertisingDto,
} from 'cartelera-unahur';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/guards/SetMetadata';

@ApiBearerAuth()
@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiResponse({ type: CourseDto })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get('/download-template/:sectorId')
  async downloadTemplete(
    @Param('sectorId') sectorId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    try {
      const excelBuffer = await this.courseService.createCommissionTemplate(
        sectorId,
      );
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

  @Public()
  @Get()
  @ApiResponse({ type: ResponseCourseDto, isArray: true })
  findAll() {
    return this.courseService.findAll();
  }

  @Public()
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
    return this.courseService.findPageAndLimit(page, limit, search);
  }

  @Public()
  @Get('/sector/:sectorId')
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
          $ref: 'number',
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
    @Body() data: { startDate: string; endDate: string; sector: number },
  ) {
    return this.courseService.uploadCommission(
      file,
      data.startDate,
      data.endDate,
      data.sector,
    );
  }
}
