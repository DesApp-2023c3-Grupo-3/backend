import { Module } from '@nestjs/common';
import { ContactosService } from './contactos.service';
import { ContactosController } from './contactos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto } from './entities/contacto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contacto])],
  controllers: [ContactosController],
  providers: [ContactosService],
})
export class ContactosModule {}
