import { registerAs } from '@nestjs/config';

type Env = 'development' | 'test' | 'production';

export interface ServerConfig {
  port: number;
  environment: Env;
  nats: {
    host: string;
    port: number;
  }
}

export default registerAs(
  'server',
  (): ServerConfig => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    environment: (process.env.NODE_ENV as Env) ?? 'development',
    nats: {
      host: process.env.NATS_HOST || 'localhost',
      port: Number(process.env.NATS_PORT) || 4222
    }
  }),
);
