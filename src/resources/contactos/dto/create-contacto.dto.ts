import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactoDto {
  @IsString()
  @ApiProperty({ example: 'María Juana' })
  readonly nombre: string;

  @IsInt()
  @ApiProperty({ example: 22 })
  readonly edad: number;

  @IsString()
  @ApiProperty({ example: 'john.doe@email.com' })
  readonly email: string;
}
