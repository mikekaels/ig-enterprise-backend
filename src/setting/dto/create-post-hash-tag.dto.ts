import { IsNotEmpty } from 'class-validator';
import { Post } from '../../shared/entity/post.entity';

export class CreatePostHashTagDto {
    readonly id: number;
    postId: number;
    hashTagId: number;
    text: string;
    post: Post[];
    createdAt: Date;
    updatedAt: Date;
}