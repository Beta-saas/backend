import { Controller, Request, Post, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login-auth.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'User login' }) // Définissez un résumé pour l'opération
    @ApiBody({ type: LoginDto }) // Spécifiez le DTO pour le corps de la requête
    @ApiResponse({ status: 200, description: 'Login successful' }) // Ajoutez une réponse pour le succès
    async login(@Request() req) {
        return this.authService.login(req.body);
    }

    @Post('validate-token')
    async validateToken(@Body() validateTokenDto: ValidateTokenDto) {
        const { token } = validateTokenDto;
        console.log('validateTokenDto:', validateTokenDto); // Ajoutez cette ligne pour voir ce qui est reçu

        try {
            const user = await this.authService.validateToken(token);
            return { valid: true, user };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
