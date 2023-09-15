import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({
    description: 'Suscripción en la pantalla',
    example: 'Tecnicatura Universitaria en Programación',
  })
  public originalName: string;

  @ApiProperty({
    description: 'Suscripción en la pantalla',
    example: 'Tecnicatura Universitaria en Programación',
  })
  public path: string;
}
