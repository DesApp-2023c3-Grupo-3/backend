import { Module } from '@nestjs/common';
import { ScreenService } from './screen.service';
import { ScreenController } from './screen.controller';
import { Screen } from 'src/entities/screen.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Screen])],
  controllers: [ScreenController],
  providers: [ScreenService],
  exports: [ScreenService],
})
export class ScreenModule {}
