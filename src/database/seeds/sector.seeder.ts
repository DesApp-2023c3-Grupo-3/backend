import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Sector } from '../../entities/sector.entity';

export default class ContactoSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Sector);
    await repository.insert([
      {
        name: 'Origone A',
        topic: 'oa',
      },
      {
        name: 'Malvinas Argentinas',
        topic: 'ma',
      },
      {
        name: 'Sector E',
        topic: 'se',
      },
      {
        name: 'Sector 6',
        topic: 's6',
      },
      {
        name: 'La Patria',
        topic: 'lp',
      },
    ]);
  }
}
