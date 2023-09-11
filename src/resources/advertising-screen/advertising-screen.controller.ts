import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdvertisingScreenService } from './advertising-screen.service';
import { CreateImageScreenDto } from './dto/create-image-screen.dto';
import { UpdateImageScreenDto } from './dto/update-image-screen.dto';

@Controller('advertising-screen')
export class AdvertisingScreenController {
  constructor(
    private readonly advertisingScreenService: AdvertisingScreenService,
  ) {}

  @Post()
  create(@Body() createImageScreenDto: CreateImageScreenDto) {
    return this.advertisingScreenService.create(createImageScreenDto);
  }

  @Get()
  findAll() {
    return this.advertisingScreenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advertisingScreenService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImageScreenDto: UpdateImageScreenDto,
  ) {
    return this.advertisingScreenService.update(+id, updateImageScreenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertisingScreenService.remove(+id);
  }
}
