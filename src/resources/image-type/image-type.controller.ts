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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ImageType')
@Controller('image-type')
export class ImageTypeController {
  constructor(private readonly imageTypeService: ImageTypeService) {}

  @Post()
  create(@Body() createImageTypeDto: CreateImageTypeDto) {
    return this.imageTypeService.create(createImageTypeDto);
  }

  @Get()
  findAll() {
    return this.imageTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImageTypeDto: UpdateImageTypeDto,
  ) {
    return this.imageTypeService.update(+id, updateImageTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageTypeService.remove(+id);
  }
}
