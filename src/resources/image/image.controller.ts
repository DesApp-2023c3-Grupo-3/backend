import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageDto, CreateImageDto, UpdateImageDto } from 'cartelera-unahur';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiResponse({ type: ImageDto })
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Get()
  @ApiResponse({ type: Array<ImageDto> })
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: ImageDto })
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: ImageDto })
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  @ApiResponse({ type: ImageDto })
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
