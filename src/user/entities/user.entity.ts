import { Comment } from "src/comment/entities/comment.entity";
import { Project } from "src/project/entities/project.entity";

export class User {
    id: number;
    name: string;
    email: string;
    password: string;

    projects?: Project;
    comments?: Comment;
}