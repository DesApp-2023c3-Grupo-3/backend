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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AdvertisingDto,
  CreateAdvertisingDto,
  ResponseAdvertisingDto,
  UpdateAdvertisingDto,
} from 'cartelera-unahur';

@ApiTags('Advertising')
@Controller('advertising')
export class AdvertisingController {
  constructor(private readonly advertisingService: AdvertisingService) {}

  @Post()
  @ApiResponse({ type: AdvertisingDto })
  create(@Body() createAdvertisingDto: CreateAdvertisingDto) {
    return this.advertisingService.create(createAdvertisingDto);
  }

  @Get()
  @ApiResponse({ type: ResponseAdvertisingDto, isArray: true })
  findAll() {
    return this.advertisingService.findAll();
  }

  @Get('/screen/:screenId')
  @ApiResponse({ type: ResponseAdvertisingDto, isArray: true })
  findTodayScreenAdvertising(@Param('screenId') screenId: number) {
    return this.advertisingService.findTodayScreenAdvertising(screenId);
  }

  @Get('/role/:roleId')
  @ApiResponse({ type: ResponseAdvertisingDto, isArray: true })
  findAllRole(@Param('roleId') roleId: number) {
    return this.advertisingService.findAllRole(roleId);
  }

  @Get(':id')
  @ApiResponse({ type: ResponseAdvertisingDto })
  findOne(@Param('id') id: string) {
    return this.advertisingService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: AdvertisingDto })
  update(
    @Param('id') id: string,
    @Body() updateAdvertisingDto: UpdateAdvertisingDto,
  ) {
    return this.advertisingService.update(+id, updateAdvertisingDto);
  }

  @Delete(':id')
  @ApiResponse({ type: AdvertisingDto })
  remove(@Param('id') id: string) {
    return this.advertisingService.remove(+id);
  }
}
