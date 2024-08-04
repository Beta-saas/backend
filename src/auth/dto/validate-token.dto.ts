import { IsNotEmpty } from 'class-validator'; // Importez les décorateurs de validation

export class ValidateTokenDto {
    @IsNotEmpty()
    token: string;
}
