import { IsNotEmpty } from 'class-validator';
import { City } from 'src/shared/entity/city.entity';
import { Gender } from 'src/shared/entity/gender.entity';

export class CreateUserDto {
    @IsNotEmpty()
    readonly id: number;
    @IsNotEmpty()
    readonly fuid: string;
    @IsNotEmpty()
    readonly username: string;
    @IsNotEmpty()
    readonly password: string;
    readonly currentPassword: string;
    @IsNotEmpty()
    readonly email: string;
    readonly secondaryEmail: string;
    @IsNotEmpty()
    readonly fullname: string;
    readonly bio: string;
    readonly website: string;
    @IsNotEmpty()
    readonly dob: string;
    @IsNotEmpty()
    readonly gender: Gender;
    @IsNotEmpty()
    readonly location: City;
    readonly city: City;
    readonly accountType: string;
    readonly tagged: string;
    readonly replies: boolean;
    readonly autoSavePost: boolean;
    readonly newMessage: boolean;
    readonly newFollowerRequest: boolean;
    readonly taggedInPost: boolean;
    readonly adminEmail: boolean;
    readonly adminPush: boolean;
    @IsNotEmpty()
    readonly interest: string;
    readonly profileImageURL200X200: string;
    readonly profileImageURL600X600: string;
    readonly profileImageURL1080X1080: string;
    readonly status: string;
    readonly publicAccount: boolean;
    readonly privateAccount: boolean;
    readonly enterpriseAccount: boolean;
    readonly approveAccount: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  }