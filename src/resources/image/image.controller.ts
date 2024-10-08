import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ImageService } from './image.service';
import { UploadImageDTO } from 'cartelera-unahur';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { Unprotected } from 'nest-keycloak-connect';

@ApiBearerAuth()
@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(public readonly imageService: ImageService) {}

  @Unprotected()
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
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(@UploadedFile() file: Express.Multer.File) {
    return this.imageService.create(file);
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
      const image = await this.imageService.findByIdAndArchivoNotIsNull(+id);
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
  @ApiOperation({ summary: 'Muestra la imagen asociada al ID' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @Get(':id/view')
  async view(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    try {
      const image = await this.imageService.findByIdAndArchivoNotIsNull(+id);
      response.setHeader('Content-Type', ['image/jpeg']);
      response.send(Buffer.from(image.base64Data, 'base64'));
    } catch (error) {
      response.status(404).send('Not Found');
    }
  }

  @ApiOperation({ summary: 'Carga al servidor un archivo excel' })
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
    return this.imageService.createJson(file);
  }

  @ApiOperation({ summary: 'Carga al servidor un json y descarga un excel' })
  @Post('json-to-excel')
  async jsonToExcel(@Body() jsonData: [], @Res() res: Response) {
    try {
      const excelData = await this.imageService.createExcelFromJSON(
        jsonData,
        'excel_output',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${excelData.fileName}`,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(excelData.buffer);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al crear el archivo Excel.',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Te permite crear un qr de una URL' })
  @Get('/qr/:url')
  async createQr(@Res() res: Response, @Param('url') url: string) {
    try {
      const qr = await this.imageService.createQr(url);
      res.setHeader('Content-Type', 'image/png');
      res.send(Buffer.from(qr.split(',')[1], 'base64'));
    } catch (error) {
      throw new HttpException(
        'Error generating qr code',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Unprotected()
  @ApiOperation({ summary: 'Crear el qr del plano' })
  @Get('qr/plane/view')
  async qrPlane(@Res() res: Response) {
    try {
      const qr = await this.imageService.qrPlane();
      res.setHeader('Content-Type', 'image/png');
      res.send(Buffer.from(qr.split(',')[1], 'base64'));
    } catch (error) {
      throw new HttpException(
        'Error generating qr code',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Unprotected()
  @ApiOperation({ summary: 'Muestra la imagen del plano' })
  @Get('/plane')
  async getImagePlane(@Res() response: Response) {
    const image = `${__dirname}/../../assets/plano.png`;
    response.setHeader('Content-Type', ['image/jpeg']);
    const imagePath = createReadStream(image);
    imagePath.pipe(response);
  }
}
