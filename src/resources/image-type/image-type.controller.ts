import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ImageTypeService } from './image-type.service';
import { CreateImageTypeDto } from './dto/create-image-type.dto';
import { UpdateImageTypeDto } from './dto/update-image-type.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageTypeDto } from 'cartelera-unahur';

@ApiTags('ImageType')
@Controller('image-type')
export class ImageTypeController {
  constructor(private readonly imageTypeService: ImageTypeService) {}

  @Post()
  @ApiResponse({ type: ImageTypeDto })
  create(@Body() createImageTypeDto: CreateImageTypeDto) {
    return this.imageTypeService.create(createImageTypeDto);
  }

  @Get()
  @ApiResponse({ type: Array<ImageTypeDto> })
  findAll() {
    return this.imageTypeService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: ImageTypeDto })
  findOne(@Param('id') id: string) {
    return this.imageTypeService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: ImageTypeDto })
  update(
    @Param('id') id: string,
    @Body() updateImageTypeDto: UpdateImageTypeDto,
  ) {
    return this.imageTypeService.update(+id, updateImageTypeDto);
  }

  @Delete(':id')
  @ApiResponse({ type: ImageTypeDto })
  remove(@Param('id') id: string) {
    return this.imageTypeService.remove(+id);
  }
}
