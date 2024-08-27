import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { FeedbackPriority, FeedbackStatus, FeedbackType, FeedbackCategory } from '@prisma/client';

export class Feedback {
    id: string;
    projectId: string;
    userEmail?: string;
    type: FeedbackType;
    category: FeedbackCategory;
    priority: FeedbackPriority;
    status: FeedbackStatus;
    description: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
