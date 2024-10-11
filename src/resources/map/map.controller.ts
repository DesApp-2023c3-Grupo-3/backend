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
  Patch,
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
import { Unprotected } from 'nest-keycloak-connect';

@ApiTags('Map')
@Controller('map')
export class MapController {
  constructor(private readonly entityService: MapService) {}

  @Unprotected()
  @ApiOperation({ summary: 'Carga al servidor un mapa' })
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
        estaSeleccionado: {
          type: 'boolean',
          description: 'Indica si la imagen está seleccionada',
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

  @Unprotected()
  @ApiOperation({ summary: 'Muestra el mapa asociado a un ID' })
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

  @Unprotected()
  @ApiOperation({ summary: 'Descargar un mapa por ID' })
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

  @Unprotected()
  @Get()
  findAll() {
    return this.entityService.findAll();
  }

  @Unprotected()
  @ApiOperation({ summary: 'Actualiza un mapa' })
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
        estaSeleccionado: {
          type: 'boolean',
          description: 'Indica si la imagen está seleccionada',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen actualizada correctamente',
    type: MapDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateEntityDto: MapDto,
  ) {
    return this.entityService.update(id, updateEntityDto, file);
  }

  @Unprotected()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entityService.remove(+id);
  }
}
