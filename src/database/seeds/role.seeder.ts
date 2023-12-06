import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../../entities/role.entity';

export default class ContactoSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Role);
    await repository.insert([
      {
        id: 1,
        name: 'Administrador',
      },
      {
        id: 2,
        name: 'Comunicaciones',
      },
      {
        id: 3,
        name: 'Gestion Estudiantil',
      },
    ]);
  }
}
