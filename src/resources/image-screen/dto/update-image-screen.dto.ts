import { PartialType } from '@nestjs/swagger';
import { CreateImageScreenDto } from './create-image-screen.dto';

export class UpdateImageScreenDto extends PartialType(CreateImageScreenDto) {}
