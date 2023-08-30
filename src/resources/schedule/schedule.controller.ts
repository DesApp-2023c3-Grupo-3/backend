import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import {
  CreateScheduleDto,
  ScheduleDto,
  UpdateScheduleDto,
} from 'cartelera-unahur';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiResponse({ type: ScheduleDto })
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  @ApiResponse({ type: ScheduleDto, isArray: true })
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: ScheduleDto })
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: ScheduleDto })
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  @ApiResponse({ type: ScheduleDto })
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
