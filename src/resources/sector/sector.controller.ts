import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SectorService } from './sector.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSectorDto, SectorDto, UpdateSectorDto } from 'cartelera-unahur';

@ApiBearerAuth()
@ApiTags('Sector')
@Controller('sector')
export class SectorController {
  constructor(private readonly sectorService: SectorService) {}

  @Post()
  @ApiResponse({ type: SectorDto })
  create(@Body() createSectorDto: CreateSectorDto) {
    return this.sectorService.create(createSectorDto);
  }

  @Get()
  @ApiResponse({ type: SectorDto, isArray: true })
  findAll() {
    return this.sectorService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: SectorDto })
  findOne(@Param('id') id: string) {
    return this.sectorService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: SectorDto })
  update(@Param('id') id: string, @Body() updateSectorDto: UpdateSectorDto) {
    return this.sectorService.update(+id, updateSectorDto);
  }

  @Delete(':id')
  @ApiResponse({ type: SectorDto })
  remove(@Param('id') id: string) {
    return this.sectorService.remove(+id);
  }
}
