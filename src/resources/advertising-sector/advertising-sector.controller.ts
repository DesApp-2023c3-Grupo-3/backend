import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdvertisingSectorService } from './advertising-sector.service';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import {
//   CreateAdvertisingSectorDto,
//   ResponseAdvertisingSectorDto,
//   UpdateAdvertisingSectorDto,
// } from 'cartelera-unahur'; // TODO: fixear y descomentar

@ApiTags('advertising-sector')
@Controller('advertising-sector')
export class AdvertisingSectorController {
  constructor(
    private readonly advertisingSectorService: AdvertisingSectorService,
  ) {}

  @Post()
  // @ApiResponse({ type: ResponseAdvertisingSectorDto }) // TODO: fixear y descomentar
  create(
    @Body() createAdvertisingSectorDto /* : CreateAdvertisingSectorDto */,
  ) {
    // TODO: fixear y descomentar
    return this.advertisingSectorService.create(createAdvertisingSectorDto);
  }

  @Get()
  findAll() {
    return this.advertisingSectorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advertisingSectorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdvertisingSectorDto /* : UpdateAdvertisingSectorDto */, // TODO: fixear y descomentar
  ) {
    return this.advertisingSectorService.update(
      +id,
      updateAdvertisingSectorDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertisingSectorService.remove(+id);
  }
}
