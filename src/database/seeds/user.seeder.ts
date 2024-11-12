import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';

export default class ContactoSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);
    await repository.insert([
      {
        name: 'admin',
        dni: '1234',
        password: 'admin1234',
        role: {
          id: 1,
        },
      },
    ]);
  }
}
