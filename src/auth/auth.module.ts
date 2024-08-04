import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// secure jwt
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '../jwt.strategy';
import { LocalStrategy } from '../local.strategy';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [
        UtilisateurModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secretKey', // Utilisez une variable d'environnement pour le secret
            signOptions: { expiresIn: '60m' },
        }),
        PrismaModule
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
