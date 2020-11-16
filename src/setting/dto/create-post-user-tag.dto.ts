import { IsNotEmpty } from 'class-validator';
import { Post } from '../../shared/entity/post.entity';

export class CreatePostUserTagDto {
    readonly id: number;
    @IsNotEmpty()
    postId: number;
    @IsNotEmpty()
    userId: number;
    userTag: any;
    taggedStatus: string;
    createdAt: Date;
    updatedAt: Date;
    post: Post[];
}