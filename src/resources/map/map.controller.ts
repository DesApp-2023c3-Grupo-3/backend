import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { MapService } from './map.service';
import { MapDto } from './dto/map.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Map')
@Controller('map')
export class MapController {
  constructor(private readonly entityService: MapService) {}

  @ApiOperation({ summary: 'Carga al servidor una imagen' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: MapDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createEntityDto: MapDto,
  ) {
    return this.entityService.create(file, createEntityDto);
  }

  @ApiOperation({ summary: 'Muestra la imagen asociada al ID' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @Get(':id/view')
  async view(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    try {
      const image = await this.entityService.findByIdAndArchivoNotIsNull(+id);
      response.setHeader('Content-Type', ['image/jpeg']);
      response.send(Buffer.from(image.base64Data, 'base64'));
    } catch (error) {
      response.status(404).send('Not Found');
    }
  }
  @ApiOperation({ summary: 'Descargar una imagen asociada al ID' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    try {
      const image = await this.entityService.findByIdAndArchivoNotIsNull(+id);
      response.setHeader('Content-Type', ['image/jpeg']);
      response.setHeader(
        'Content-Disposition',
        `attachment; filename=${image.originalName}`,
      );
      response.send(Buffer.from(image.base64Data, 'base64'));
    } catch (error) {
      response.status(404).send('Not Found');
    }
  }
  @Get()
  findAll() {
    return this.entityService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entityService.remove(+id);
  }
}
