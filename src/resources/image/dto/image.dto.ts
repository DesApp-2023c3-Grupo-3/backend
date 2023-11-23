import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  id: number;

  originalName: string;

  @ApiProperty()
  base64Data: string;
}
