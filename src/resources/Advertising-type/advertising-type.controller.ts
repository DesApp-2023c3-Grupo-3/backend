import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdvertisingTypeService } from './advertising-type.service';
import {
  ImageTypeDto,
  CreateImageTypeDto,
  UpdateImageTypeDto,
} from 'cartelera-unahur';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('AdvertisingType')
@Controller('advertising-type')
export class AdvertisingTypeController {
  constructor(private readonly imageTypeService: AdvertisingTypeService) {}

  @Post()
  @ApiResponse({ type: ImageTypeDto })
  create(@Body() createImageTypeDto: CreateImageTypeDto) {
    return this.imageTypeService.create(createImageTypeDto);
  }

  @Get()
  @ApiResponse({ type: ImageTypeDto, isArray: true })
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
