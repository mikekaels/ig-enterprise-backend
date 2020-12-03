import { IsNotEmpty } from 'class-validator';
import { Post } from '../../shared/entity/post.entity';

export class CreatePostShareDto {
    readonly id: number;
    @IsNotEmpty()
    postId: number;
    @IsNotEmpty()
    userId: number;
    share: string;
    createdAt: Date;
    post: Post[];
}