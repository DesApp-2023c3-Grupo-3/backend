import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { AdvertisingType } from '../../entities/advertising-type.entity';

export default class ContactoSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(AdvertisingType);
    await repository.insert([
      {
        name: 'Image',
      },
      {
        name: 'Video',
      },
      {
        name: 'Text',
      },
    ]);
  }
}
