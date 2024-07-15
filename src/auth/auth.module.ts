import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';

const jwtConfig: JWTConfig = config.get('jwt');

interface JWTConfig{
  expiresIn: number;
  secret: string;
}

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: process.env.JWT_SECRET || jwtConfig.secret,
     signOptions: {
      expiresIn: jwtConfig.expiresIn,
    },
  }
  )],
  controllers: [AuthController,],
  providers: [AuthService, UserRepository, JwtStrategy,],
  exports: [JwtStrategy, PassportModule,],
})
export class AuthModule { }
