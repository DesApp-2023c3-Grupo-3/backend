import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
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
import { multerOptions, parseFilePipeBuilder } from 'src/config/uploads.config';
import { UploadImageDTO } from 'cartelera-unahur';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(public readonly roleService: ImageService) {}

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
    return this.roleService.create(file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }
}
