import { IsNotEmpty } from 'class-validator';
import { Post } from '../../shared/entity/post.entity';

export class CreateBookMarkDto {
    @IsNotEmpty()
    readonly id: number;
    @IsNotEmpty()
    readonly postId: number;
    @IsNotEmpty()
    readonly userId: number;
    createdAt: Date;
    post: Post[];
  }