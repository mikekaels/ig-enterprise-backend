import { IsNotEmpty } from 'class-validator';

export class FollowDto {
    readonly id: number;
    readonly uid: number;
    @IsNotEmpty()
    readonly followerId: number;
    @IsNotEmpty()
    readonly followingId: number;
    readonly status: string;
    readonly favourite: boolean;
    createdAt: Date;
    updatedAt: Date;
}