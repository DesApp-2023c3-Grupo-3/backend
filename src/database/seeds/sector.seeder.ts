import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Sector } from '../../entities/sector.entity';

export default class ContactoSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Sector);
    await repository.insert([
      {
        name: 'Malvinas Argentinas',
        topic: 'ma',
      },
      {
        name: 'Gratuidad Universitaria',
        topic: 'gu',
      },
      {
        name: 'Trabajo Argentino',
        topic: 'ta',
      },
      {
        name: 'Justicia Social',
        topic: 's6',
      },
      {
        name: 'La Patria',
        topic: 'lp',
      },
    ]);
  }
}
