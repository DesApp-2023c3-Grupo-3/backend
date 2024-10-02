import { Module } from '@nestjs/common';
import { CreateUserToken } from './createUserToken.service';
import { UserModule } from 'src/resources/user/user.module';

@Module({
  providers: [CreateUserToken],
  exports: [CreateUserToken],
  imports: [UserModule],
})
export class TokenMiddlewareValidate {}
