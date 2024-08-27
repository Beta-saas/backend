import { User } from 'src/user/entities/user.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { ApiProperty } from '@nestjs/swagger';

export class Comment {
    @ApiProperty()
    id: string;

    @ApiProperty()
    feedbackId: string;

    @ApiProperty()
    feedback: Feedback;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    user: User;

    @ApiProperty()
    content: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
