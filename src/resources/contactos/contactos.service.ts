import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactoDto, UpdateContactoDto } from 'cartelera-unahur';
import { Contacto } from '../../entities/contacto.entity';

@Injectable()
export class ContactosService {
  constructor(
    @InjectRepository(Contacto)
    private repository: Repository<Contacto>,
  ) {}

  create(createContactoDto: CreateContactoDto) {
    return this.repository.save(createContactoDto);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneByOrFail({ id });
  }

  update(id: number, updateContactoDto: UpdateContactoDto) {
    return this.repository.update({ id }, updateContactoDto);
  }

  remove(id: number) {
    return this.repository.delete({ id });
  }
}
