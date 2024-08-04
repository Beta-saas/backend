import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UtilisateurService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && bcrypt.compareSync(password, user.mot_de_passe)) {
            return { ...user, mot_de_passe: undefined };
        }
        return null;
    }

    async login(user: any) {
        const userloged = await this.validateUser(user.email, user.mot_de_passe);

        if (userloged) {
            const payload = { username: userloged.email, sub: userloged.id };
            return {
                access_token: this.jwtService.sign(payload),
            };
        } else {
            // Si l'utilisateur n'est pas authentifié avec succès, retourner une erreur ou null
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async validateToken(token: string): Promise<any> {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.usersService.findOne(decoded.sub);
            const payload = { username: user.email, sub: user.id };
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            return { user: user, access_token: this.jwtService.sign(payload) };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
