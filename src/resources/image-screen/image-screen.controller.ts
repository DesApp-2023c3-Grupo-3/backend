import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ImageScreenService } from './image-screen.service';
import { CreateImageScreenDto } from './dto/create-image-screen.dto';
import { UpdateImageScreenDto } from './dto/update-image-screen.dto';

@Controller('image-screen')
export class ImageScreenController {
  constructor(private readonly imageScreenService: ImageScreenService) {}

  @Post()
  create(@Body() createImageScreenDto: CreateImageScreenDto) {
    return this.imageScreenService.create(createImageScreenDto);
  }

  @Get()
  findAll() {
    return this.imageScreenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageScreenService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImageScreenDto: UpdateImageScreenDto,
  ) {
    return this.imageScreenService.update(+id, updateImageScreenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageScreenService.remove(+id);
  }
}
