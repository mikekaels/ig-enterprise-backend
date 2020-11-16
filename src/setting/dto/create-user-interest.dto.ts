import { IsNotEmpty } from 'class-validator';

export class CreateUserInterestDto {
    readonly id: number;
    @IsNotEmpty()
    readonly userId: number;
    @IsNotEmpty()
    readonly interestId: number;
    interest: string;
    createdAt: Date;
    updatedAt: Date;
}