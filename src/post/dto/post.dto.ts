import { IsNotEmpty } from 'class-validator';

export class PostDto {
    readonly id: number;
    @IsNotEmpty()
    readonly uid: number;
    @IsNotEmpty()
    readonly fuid: number;
    @IsNotEmpty()
    readonly content: string;
    @IsNotEmpty()
    readonly imageURL200x200: string;
    @IsNotEmpty()
    readonly imageURL600x600: string;
    @IsNotEmpty()
    readonly imageURL1080x1080: string;
    readonly interest: string;
    readonly userTag: any;
    readonly hashTag: string;
    createdAt: Date;
    updatedAt: Date;
    readonly promotion: boolean;
    readonly editedImage: boolean;
    readonly status: string;
}