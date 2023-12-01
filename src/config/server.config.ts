import { registerAs } from '@nestjs/config';

type Env = 'development' | 'test' | 'production';

export interface ServerConfig {
  port: number;
  environment: Env;
  socket: {
    port: number;
  };
}

export default registerAs(
  'server',
  (): ServerConfig => ({
    port: parseInt(process.env.PORTT, 10) || 4000,
    environment: (process.env.NODE_ENV as Env) ?? 'development',
    socket: {
      port: Number(process.env.SOCKET_PORT) || 1234,
    },
  }),
);
