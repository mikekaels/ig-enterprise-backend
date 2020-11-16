import { IsNotEmpty } from 'class-validator';

export class CreatePostInterestDto {
    readonly id: number;
    @IsNotEmpty()
    readonly postId: number;
    @IsNotEmpty()
    readonly interestId: number;
    readonly interest: string;
    createdAt: Date;
    updatedAt: Date;
}