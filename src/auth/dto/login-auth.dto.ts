// login.dto.ts

import { IsEmail, IsNotEmpty } from 'class-validator'; // Importez les décorateurs de validation

export class LoginDto {
    @IsNotEmpty() // Assurez-vous que l'email n'est pas vide
    @IsEmail() // Assurez-vous que l'email est un email valide
    email: string;

    // TODO: ajouter des rêgles de vérification mdp exemple : min charactére, maj, spécial chat ...
    @IsNotEmpty() // Assurez-vous que le mot de passe n'est pas vide
    password: string;
}
