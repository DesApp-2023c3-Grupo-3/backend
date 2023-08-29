import { registerAs } from '@nestjs/config';

type Env = 'development' | 'test' | 'production';

export interface ServerConfig {
  port: number;
  environment: Env;
  sockets: {
    port: number;
  };
}

export default registerAs(
  'server',
  (): ServerConfig => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    environment: (process.env.NODE_ENV as Env) ?? 'development',
    sockets: {
      port: Number(process.env.SOCKETS_PORT) || 4222,
    },
  }),
);
