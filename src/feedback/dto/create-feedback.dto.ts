import { IsNotEmpty, IsString, IsEnum, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';
import { FeedbackPriority, FeedbackStatus, FeedbackType, FeedbackCategory } from '@prisma/client';

export class CreateFeedbackDto {
    @IsString()
    projectId: string;

    @IsOptional()
    @IsString()
    userEmail?: string;

    @IsEnum(FeedbackType)
    type: FeedbackType;

    @IsEnum(FeedbackCategory)
    category: FeedbackCategory;

    @IsEnum(FeedbackPriority)
    priority: FeedbackPriority;

    @IsEnum(FeedbackStatus)
    status: FeedbackStatus;

    @IsString()
    description: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    tags: string[];
}
