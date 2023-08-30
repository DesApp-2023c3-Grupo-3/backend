import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateSubjectDto,
  SubjectDto,
  UpdateSubjectDto,
} from 'cartelera-unahur';

@ApiTags('Subject')
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @ApiResponse({ type: SubjectDto })
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Get()
  @ApiResponse({ type: SubjectDto, isArray: true })
  findAll() {
    return this.subjectService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: SubjectDto })
  findOne(@Param('id') id: string) {
    return this.subjectService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: SubjectDto })
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectService.update(+id, updateSubjectDto);
  }

  @Delete(':id')
  @ApiResponse({ type: SubjectDto })
  remove(@Param('id') id: string) {
    return this.subjectService.remove(+id);
  }
}
