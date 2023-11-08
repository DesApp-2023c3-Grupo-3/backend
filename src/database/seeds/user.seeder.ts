import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';

export default class ContactoSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);
    await repository.insert([
      {
        name: 'Admin User',
        dni: '12345678',
        password:
          '$2b$12$BpOJzg8dYmO9hThAL897X.QpyO7V09NEoJJadPsqWKc7zSEAnVaru',
        role: {
          id: 1,
        },
      },
    ]);
  }
}
