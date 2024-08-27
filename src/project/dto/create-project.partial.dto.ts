// src/project/dto/create-project.partial.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProjectPartialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}