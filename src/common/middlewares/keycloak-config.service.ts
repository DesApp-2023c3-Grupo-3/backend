import { Injectable } from '@nestjs/common';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
} from 'nest-keycloak-connect';

function checkDefined<T>(value: T, errorMessage: string): T {
  if (value === undefined) {
    throw new Error(errorMessage);
  }
  return value;
}

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: process.env.KEYCLOAK_URL ?? 'http://localhost:8080',
      realm: process.env.KEYCLOAK_REALM ?? 'cartelera',
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'cartelera-back',
      secret: checkDefined(
        process.env.KEYCLOAK_CLIENT_SECRET,
        'FALTA KEYCLOAK_CLIENT_SECRET en el ' + '.env',
      ),
      useNestLogger: true,
    };
  }
}
