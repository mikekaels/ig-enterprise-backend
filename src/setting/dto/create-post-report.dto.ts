import { IsNotEmpty } from 'class-validator';

export class CreatePostReportDto {
    id: number;
    @IsNotEmpty()
    postId: number;
    @IsNotEmpty()
    reportId: number;
    @IsNotEmpty()
    userId: number;
    createdAt: Date;
}