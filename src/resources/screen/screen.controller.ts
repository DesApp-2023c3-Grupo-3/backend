import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScreenService } from './screen.service';
import {
  CreateScreenDto,
  ResponseScreenDto,
  UpdateScreenDto,
} from 'cartelera-unahur';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Screen')
@Controller('screen')
export class ScreenController {
  constructor(private readonly screenService: ScreenService) {}

  @ApiResponse({ type: CreateScreenDto })
  @Post()
  create(@Body() createScreenDto: CreateScreenDto) {
    return this.screenService.create(createScreenDto);
  }

  @ApiResponse({ type: ResponseScreenDto })
  @Get()
  findAll() {
    return this.screenService.findAll();
  }

  @ApiResponse({ type: ResponseScreenDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screenService.findOne(+id);
  }

  @ApiResponse({ type: UpdateScreenDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScreenDto: UpdateScreenDto) {
    return this.screenService.update(+id, updateScreenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.screenService.remove(+id);
  }
}
