import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ImageService } from './image.service';
import {
  filesConfigImage,
  multerOptions,
  parseFilePipeBuilder,
} from 'src/config/uploads.config';
import { UploadImageDTO } from 'cartelera-unahur';
import type { Response } from 'express';
import { createReadStream } from 'fs';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(public readonly imageService: ImageService) {}

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
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: UploadImageDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('file', multerOptions()))
  @Post()
  create(@UploadedFile(parseFilePipeBuilder) file: Express.Multer.File) {
    return this.imageService.create(file);
  }

  @ApiOperation({ summary: 'Descargar una imagen asociada al ID' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const image = await this.imageService.findByIdAndArchivoNotIsNull(+id);
    const imagePath = createReadStream(image.path);
    response.set(filesConfigImage.responseHeaders(image.path));
    return new StreamableFile(imagePath);
  }

  @ApiOperation({ summary: 'Muestra la imagen asociada al ID' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @Get(':id/view')
  async view(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    const image = await this.imageService.findByIdAndArchivoNotIsNull(+id);
    response.setHeader('Content-Type', ['image/jpeg']);
    const imagePath = createReadStream(image.path);
    imagePath.pipe(response);
  }
}
