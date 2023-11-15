import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6Ikp1YW4gTG9wZXoiLCJyb2xlIjp7ImlkIjoxLCJuYW1lIjoiR2VzdGnDs24gRXN0dWRpYW50aWwiLCJjcmVhdGVkQXQiOiIyMDIzLTEwLTI0VDE0OjQ1OjI4LjUyN1oiLCJ1cGRhdGVkQXQiOiIyMDIzLTEwLTI0VDE0OjQ1OjI4LjUyN1oiLCJkZWxldGVkQXQiOm51bGx9LCJpYgXQiOjE2OTg4NzEzMDYsImV4cCI6MTY5ODk1NzcwNn0.PGIczzdpuyOXKa9k-YEYJ2TyqnmYCO1Z-SAu6CkmM3E',
  })
  public refreshToken: string;
}
