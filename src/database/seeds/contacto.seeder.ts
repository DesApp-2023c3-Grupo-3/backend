import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Contacto } from '../../resources/contactos/entities/contacto.entity';

export default class ContactoSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Contacto);
    await repository.insert([
      {
        nombre: 'Bartolina Sisa',
        edad: 32,
      },
      {
        nombre: 'Tupac Katari',
        edad: 31,
      },
    ]);
  }
}
