import { Controller, Get, Post, Req, Res, Request, Body, Param } from '@nestjs/common';
import { SettingService } from './setting.service';
import { Interest } from '../shared/entity/interest.entity';
import { UserInterest } from '../shared/entity/user_interest.entity';
import { CreateUserInterestDto } from './dto/create-user-interest.dto';
import { Country } from '../shared/entity/country.entity';
import { Region } from '../shared/entity/region.entity';
import { City } from '../shared/entity/city.entity';
import { CreatePostInterestDto } from './dto/create-post-interest.dto';
import { CreatePostUserTagDto } from './dto/create-post-user-tag.dto';
import { PostUserTag } from '../shared/entity/post_user_tag.entity';
import { CreatePostReportDto } from './dto/create-post-report.dto';

@Controller('setting')
export class SettingController {
    constructor(
        private readonly settingService: SettingService,
    ) { }

    @Get('interest')
    async getAllInterest(): Promise<Interest[]> {
        return await this.settingService.findAllInterest();
    }

    @Get('id/interest/:id')
    async getUserInterestById(@Param('id') id: number): Promise<UserInterest[]> {
        return await this.settingService.findAllUserInterest({ id: id });
    }

    @Get('userid/interest/:userId')
    async getUserInterestByUserId(@Param('userId') userId: number): Promise<UserInterest[]> {
        return await this.settingService.findAllUserInterest({ userId: userId });
    }

    @Post('create/user/interest')
    createUserInterest(@Body() createUserInterestDto: CreateUserInterestDto[]): void {
        this.settingService.saveUserInterest(createUserInterestDto);
    }

    @Post('update/user/interest')
    async updateUserInterest(@Body() createUserInterestDto: CreateUserInterestDto): Promise<any> {
        return await this.settingService.updateUserInterest(createUserInterestDto);
    }


    @Post('create/post/interest')
    createPostInterest(@Body() createPostInterestDto: CreatePostInterestDto): void {
        const createPostInterestDtoArray = [];
        for (const i of createPostInterestDto.interest.split(",")) {
            createPostInterestDtoArray.push({ postId: createPostInterestDto.postId, interestId: i, createdAt: new Date(), updatedAt: new Date() });
        }
        this.settingService.savePostInterest(createPostInterestDtoArray);
    }

    @Post('create/post/user/tag')
    async createPostUserTag(): Promise<any> {
        const createPostUserTagDto = new CreatePostUserTagDto();
        createPostUserTagDto.postId = 15;
        createPostUserTagDto.userTag = [{ "id": 1, "taggedStatus": "A" }, { "id": 2, "taggedStatus": "M" }];
        const createPostInterestDtoArray = [];
        for (const tag of createPostUserTagDto.userTag) {
            createPostInterestDtoArray.push({ postId: createPostUserTagDto.postId, userId: tag.id, taggedStatus: tag.taggedStatus, createdAt: new Date() });
        }
        // return createPostInterestDtoArray;
        return await this.settingService.savePostUserTag(createPostInterestDtoArray);
    }


    @Get('find/post/user/tag')
    async findPostUserTag(): Promise<PostUserTag[]> {
        return await this.settingService.findPostUserTag();
    }

    @Get('location')
    async getAllLocation(): Promise<Country[]> {
        return await this.settingService.findAllLocation();
    }

    @Get('city')
    async gettAllCity(): Promise<Country[]> {
        return await this.settingService.findAllCity();
    }

    @Get('region/location/:countryId')
    async getRegion(@Param('countryId') countryId: number): Promise<Region[]> {
        return await this.settingService.findRegionById({ countryId: countryId });
    }

    @Get('city/location/:regionId')
    async getCity(@Param('regionId') regionId: number): Promise<City[]> {
        return await this.settingService.findCityById({ regionId: regionId });
    }

    @Post('save/report')
    async saveReport(@Body() createPostReportDto: CreatePostReportDto): Promise<any> {
        return await this.settingService.saveReport(createPostReportDto);
    }

    @Get('find/report/:userId/:postId')
    async findReport(@Param('userId') userId: number, @Param('postId') postId: number): Promise<any> {
        return await this.settingService.findReport(userId, postId);
    }

}
