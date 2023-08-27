import { Module } from '@nestjs/common';
import { ScreenService } from './screen.service';
import { ScreenController } from './screen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screen } from 'src/entities/screen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Screen])],
  controllers: [ScreenController],
  providers: [ScreenService],
})
export class ScreenModule {}
