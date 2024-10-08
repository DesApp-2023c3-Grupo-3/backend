import { ApiProperty } from '@nestjs/swagger';

export class MapDto {
  name: string;
  originalName: string;
  path: string;
  deletedAt: Date;
}
