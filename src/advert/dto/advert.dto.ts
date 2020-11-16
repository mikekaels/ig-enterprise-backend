import { IsNotEmpty } from 'class-validator';
import { City } from 'src/shared/entity/city.entity';
import { Gender } from 'src/shared/entity/gender.entity';

export class AdvertDto {
    readonly id: number;
    readonly uid: number;
    @IsNotEmpty()
    readonly minAge: number;
    @IsNotEmpty()
    readonly maxAge: number;
    @IsNotEmpty()
    readonly timezone: string;
    @IsNotEmpty()
    readonly fromTime: Date;
    @IsNotEmpty()
    readonly toTime: Date;
    @IsNotEmpty()
    readonly placement: string;
    @IsNotEmpty()
    readonly budget: number;
    createdAt: Date;
    updatedAt: Date;
    readonly city: City;
    readonly gender: Gender;

    readonly promotion: boolean;
    readonly editedImage: boolean;
    readonly status: string;

    readonly content: string;
    readonly interest: string;
    readonly userTag: any;

    readonly imageURL200x200: string;
    readonly imageURL600x600: string;
    readonly imageURL1080x1080: string;
}