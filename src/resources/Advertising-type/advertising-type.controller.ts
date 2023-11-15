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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AdvertisingTypeDto,
  CreateAdvertisingTypeDto,
  UpdateAdvertisingTypeDto,
} from 'cartelera-unahur';

@ApiBearerAuth()
@ApiTags('AdvertisingType')
@Controller('advertising-type')
export class AdvertisingTypeController {
  constructor(
    private readonly advertisingTypeService: AdvertisingTypeService,
  ) {}

  @Post()
  @ApiResponse({ type: AdvertisingTypeDto })
  create(@Body() createAdvertisingTypeDto: CreateAdvertisingTypeDto) {
    return this.advertisingTypeService.create(createAdvertisingTypeDto);
  }

  @Get()
  @ApiResponse({ type: AdvertisingTypeDto, isArray: true })
  findAll() {
    return this.advertisingTypeService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: AdvertisingTypeDto })
  findOne(@Param('id') id: string) {
    return this.advertisingTypeService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: AdvertisingTypeDto })
  update(
    @Param('id') id: string,
    @Body() updateAdvertisingTypeDto: UpdateAdvertisingTypeDto,
  ) {
    return this.advertisingTypeService.update(+id, updateAdvertisingTypeDto);
  }

  @Delete(':id')
  @ApiResponse({ type: AdvertisingTypeDto })
  remove(@Param('id') id: string) {
    return this.advertisingTypeService.remove(+id);
  }
}
