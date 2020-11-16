import { IsNotEmpty } from 'class-validator';

export class CreateAdvertInterestDto {
    readonly id: number;
    @IsNotEmpty()
    readonly advertId: number;
    @IsNotEmpty()
    readonly interestId: number;
    interest: string;
    createdAt: Date;
    updatedAt: Date;
}