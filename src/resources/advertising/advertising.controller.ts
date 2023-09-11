import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdvertisingService } from './advertising.service';
import {
  ImageDto,
  CreateImageDto,
  UpdateImageDto,
  ResponseImageDto,
} from 'cartelera-unahur';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Advertising')
@Controller('advertising')
export class AdvertisingController {
  constructor(private readonly advertisingService: AdvertisingService) {}

  @Post()
  @ApiResponse({ type: ImageDto })
  create(@Body() createImageDto: CreateImageDto) {
    return this.advertisingService.create(createImageDto);
  }

  @Get()
  @ApiResponse({ type: ResponseImageDto, isArray: true })
  findAll() {
    return this.advertisingService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: ResponseImageDto })
  findOne(@Param('id') id: string) {
    return this.advertisingService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: ImageDto })
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.advertisingService.update(+id, updateImageDto);
  }

  @Delete(':id')
  @ApiResponse({ type: ImageDto })
  remove(@Param('id') id: string) {
    return this.advertisingService.remove(+id);
  }
}
