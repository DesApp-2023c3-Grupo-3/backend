import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdvertisingScheduleService } from './advertising-schedule.service';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateAdvertisingScheduleDto,
  ResponseAdvertisingScheduleDto,
  UpdateAdvertisingScheduleDto,
} from 'cartelera-unahur';

@ApiBearerAuth()
@ApiTags('advertising-schedule')
@Controller('advertising-schedule')
export class AdvertisingScheduleController {
  constructor(
    private readonly advertisingScheduleService: AdvertisingScheduleService,
  ) {}

  @Post()
  @ApiResponse({ type: ResponseAdvertisingScheduleDto })
  create(@Body() createAdvertisingScheduleDto: CreateAdvertisingScheduleDto) {
    return this.advertisingScheduleService.create(createAdvertisingScheduleDto);
  }

  @Get()
  findAll() {
    return this.advertisingScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advertisingScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdvertisingScheduleDto: UpdateAdvertisingScheduleDto,
  ) {
    return this.advertisingScheduleService.update(
      +id,
      updateAdvertisingScheduleDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertisingScheduleService.remove(+id);
  }
}
