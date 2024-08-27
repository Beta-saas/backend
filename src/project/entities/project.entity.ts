import { User } from "src/user/entities/user.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";

export class Project {
    id: string;
    name: string;
    description: string;
    userId: string;
    user?: User;
    feedbacks?: Feedback[];
}
