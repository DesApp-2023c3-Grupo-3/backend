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
import {
  CreateAdvertisingScreenDto,
  UpdateAdvertisingScreenDto,
} from 'cartelera-unahur';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('advertising-screen')
export class AdvertisingScreenController {
  constructor(
    private readonly advertisingScreenService: AdvertisingScreenService,
  ) {}

  @Post()
  create(@Body() createAdvertisingScreenDto: CreateAdvertisingScreenDto) {
    return this.advertisingScreenService.create(createAdvertisingScreenDto);
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
    @Body() updateAdvertisingScreenDto: UpdateAdvertisingScreenDto,
  ) {
    return this.advertisingScreenService.update(
      +id,
      updateAdvertisingScreenDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertisingScreenService.remove(+id);
  }
}
