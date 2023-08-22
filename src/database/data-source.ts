import { join } from 'path';
import { DataSource } from 'typeorm';
import typeOrmConfig from '../config/typeOrm.config';

const dataSource = new DataSource({
  ...typeOrmConfig,
  type: 'postgres',
  entities: [
    'dist/**/entities/*.entity{.ts,.js}',
    join(__dirname, '..', '**/entities/*.entity{.ts,.js}'),
  ],
  migrations: ['src/database/migrations/*{.ts,.js}'],
});

export default dataSource;
