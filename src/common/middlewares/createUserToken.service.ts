import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'; // Importa la biblioteca jwt
import { UserService } from 'src/resources/user/user.service';

@Injectable()
export class CreateUserToken implements NestMiddleware {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Formato de token inválido');
    }
    try {
      const decoded = jwt.decode(token, { complete: true });

      if (!decoded) {
        throw new UnauthorizedException('Token inválido');
      }
      const payload = (req['tokenPayload'] = decoded.payload);
      const user = await this.userService.getUserByDni(payload['Documento']);
      if (!user) {
        this.userService.create({
          dni: payload['Documento'],
          name: payload['name'],
          password: '1111',
          role: { id: 2 },
          idKeycloak: payload['sub'].toString(),
        });
      }
      next();
    } catch (error) {
      throw new UnauthorizedException('Error al decodificar el token');
    }
  }
}
