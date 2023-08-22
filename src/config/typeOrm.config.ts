import { ConfigModule } from '@nestjs/config';
import serverConfig from './server.config';

// Forzamos la carga del archivo .env antes de leer las variables de entorno.
ConfigModule.forRoot({});
const { environment } = serverConfig();

const url = process.env.DATABASE_URL;

const credentials = url
  ? { url }
  : {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'admin1234',
      database: process.env.DATABASE_NAME || `contactos_${environment}`,
    };

const typeOrmConfig = {
  type: 'postgres',
  ...credentials,
};

export default typeOrmConfig;
