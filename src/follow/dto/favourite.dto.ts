import { IsNotEmpty } from 'class-validator';

export class FavouriteDto {
    readonly id: number;
    readonly userId: number;
    @IsNotEmpty()
    readonly favouriteId: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}