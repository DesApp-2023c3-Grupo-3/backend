import { PartialType } from '@nestjs/swagger';
import { CreateCourseScreenDto } from './create-course-screen.dto';

export class UpdateCourseScreenDto extends PartialType(CreateCourseScreenDto) {}
