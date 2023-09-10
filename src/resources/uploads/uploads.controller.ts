import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
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
import {
  multerOptions,
  parseFilePipeBuilder,
} from '../../config/uploads.config';
import { UploadImageResponseDTO } from 'cartelera-unahur';

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  @ApiOperation({ summary: 'Carga al servidor un archivo de Cargo' })
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
    type: UploadImageResponseDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('file', multerOptions()))
  @Post('/cargos')
  uploadFileCargo(
    @UploadedFile(parseFilePipeBuilder)
    file: Express.Multer.File,
  ) {
    return new UploadImageResponseDTO(file);
  }
}
