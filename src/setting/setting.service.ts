import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, getRepository } from 'typeorm';
import { Interest } from '../shared/entity/interest.entity';
import { CreateUserInterestDto } from './dto/create-user-interest.dto';
import { UserInterest } from '../shared/entity/user_interest.entity';
import { Country } from '../shared/entity/country.entity';
import { Region } from '../shared/entity/region.entity';
import { City } from '../shared/entity/city.entity';
import { CreatePostInterestDto } from './dto/create-post-interest.dto';
import { PostInterest } from '../shared/entity/post_interest.entity';
import { CreatePostUserTagDto } from './dto/create-post-user-tag.dto';
import { PostUserTag } from '../shared/entity/post_user_tag.entity';
import { CreatePostHashTagDto } from './dto/create-post-hash-tag.dto';
import { HashTag } from '../shared/entity/hashtag.entity';
import { ReportPost } from '../shared/entity/report_post.entity';
import { CreatePostReportDto } from './dto/create-post-report.dto';
import { Report } from '../shared/entity/report.entity';
import { AdvertInterest } from '../shared/entity/advert_interest.entity';
import { CreateAdvertInterestDto } from './dto/create-advert-interest.dto';

@Injectable()
export class SettingService {
    constructor(
        @InjectRepository(HashTag)
        private readonly postHashTagRepository: Repository<HashTag>,
        @InjectRepository(PostUserTag)
        private readonly postUserTagRepository: Repository<PostUserTag>,
        @InjectRepository(Interest)
        private readonly interestRepository: Repository<Interest>,
        @InjectRepository(UserInterest)
        private readonly userInterestRepository: Repository<UserInterest>,
        @InjectRepository(Country)
        private readonly countryRepository: Repository<Country>,
        @InjectRepository(Region)
        private readonly regionRepository: Repository<Region>,
        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,
        @InjectRepository(ReportPost)
        private readonly reportPostRepository: Repository<ReportPost>,
    ) { }

    async saveAdvertInterest(advertInterestDto: CreateAdvertInterestDto[]): Promise<AdvertInterest[]> {
        try {
            const interest: AdvertInterest[] = [];
            for (const interestDto in advertInterestDto) {
                advertInterestDto[interestDto].createdAt = advertInterestDto[interestDto].createdAt == null ? new Date() : advertInterestDto[interestDto].createdAt;
                advertInterestDto[interestDto].updatedAt = advertInterestDto[interestDto].updatedAt == null ? new Date() : advertInterestDto[interestDto].updatedAt;
                interest.push(advertInterestDto[interestDto]);

            }
            const interestRepo = getRepository(AdvertInterest);
            return await interestRepo.save(interest);
        } catch (err) {
            return err;
        }

    }

    async saveUserInterest(userInterestDto: CreateUserInterestDto[]): Promise<UserInterest[]> {
        try {
            console.log(userInterestDto);
            const userInterest: UserInterest[] = [];
            for (const interestDto in userInterestDto) {
                userInterestDto[interestDto].createdAt = userInterestDto[interestDto].createdAt == null ? new Date() : userInterestDto[interestDto].createdAt;
                userInterestDto[interestDto].updatedAt = userInterestDto[interestDto].updatedAt == null ? new Date() : userInterestDto[interestDto].updatedAt;
                userInterest.push(userInterestDto[interestDto]);

            }
            const userInterestRepo = getRepository(UserInterest);
            return await userInterestRepo.save(userInterest);
        } catch (err) {
            return err;
        }

    }

    async savePostInterest(postInterestDto: CreatePostInterestDto[]): Promise<PostInterest[]> {
        try {
            const postInterest: PostInterest[] = [];
            for (const interestDto in postInterestDto) {
                postInterestDto[interestDto].createdAt = postInterestDto[interestDto].createdAt == null ? new Date() : postInterestDto[interestDto].createdAt;
                postInterest.push(postInterestDto[interestDto]);

            }
            const postInterestRepo = getRepository(PostInterest);
            return await postInterestRepo.save(postInterest);
        } catch (err) {
            return err;
        }

    }

    async savePostUserTag(postUserTagDto: CreatePostUserTagDto[]): Promise<PostUserTag[]> {
        try {
            const postUserTag: PostUserTag[] = [];
            for (const userTagDto in postUserTagDto) {
                postUserTagDto[userTagDto].createdAt = postUserTagDto[userTagDto].createdAt == null ? new Date() : postUserTagDto[userTagDto].createdAt;
                postUserTag.push(postUserTagDto[userTagDto]);

            }
            return await this.postUserTagRepository.save(postUserTag);
        } catch (err) {
            return err;
        }

    }

    async savePostHashTag(postHashTagDto: CreatePostHashTagDto[]): Promise<HashTag[]> {
        try {
            const postHashTag: HashTag[] = [];
            for (const hashTagDto in postHashTagDto) {
                postHashTagDto[hashTagDto].createdAt = postHashTagDto[hashTagDto].createdAt == null ? new Date() : postHashTagDto[hashTagDto].createdAt;
                postHashTag.push(postHashTagDto[hashTagDto]);

            }
            return await this.postHashTagRepository.save(postHashTag);
        } catch (err) {
            return err;
        }
    }

    //=======================
    async findHashTag(findData: FindConditions<HashTag>): Promise<HashTag[]> {
        return this.postHashTagRepository.find(findData);

    }

    async searchHashTag(search: string): Promise<HashTag[]> {
        const searchPattern = "%" + search + "%";
        return await getRepository(HashTag)
            .createQueryBuilder("hashtag")
            .select("hashtag.text", "text")
            .addSelect("count(hashtag.text)", "totalCount")
            .where("hashtag.text like :text", { text: searchPattern })
            .groupBy("hashtag.text")
            .getRawMany();
    }

    async findPostUserTag(): Promise<PostUserTag[]> {
        return this.postUserTagRepository.find();
    }

    async findAllInterest(): Promise<Interest[]> {
        return this.interestRepository.find();
    }

    async findAllUserInterest(findData: FindConditions<UserInterest>): Promise<UserInterest[]> {
        return this.userInterestRepository.find(findData);
    }

    async findAllLocation(): Promise<Country[]> {
        return this.countryRepository.find();
    }

    async findRegionById(findData: FindConditions<Region>): Promise<Region[]> {
        return this.regionRepository.find(findData);
    }

    async findCityById(findData: FindConditions<City>): Promise<City[]> {
        return this.cityRepository.find(findData);
    }

    async findAllCity(): Promise<City[]> {
        return this.cityRepository.find();
    }

    async findReport(userId: number, postId: number): Promise<any> {
        const findData = { where: { userId: userId, postId: postId } };
        const reportPost = await this.reportPostRepository.findOne(findData);
        const report = await this.reportRepository.find();
        return { report: report, reportPost: reportPost };
    }

    async saveReport(createPostReportDto: CreatePostReportDto): Promise<any> {
        try {
            const findData = { where: { userId: createPostReportDto.userId, postId: createPostReportDto.postId } };
            const reportPost = await this.reportPostRepository.findOne(findData);
            if (reportPost) {
                await this.reportPostRepository.update(reportPost.id, { reportId: createPostReportDto.reportId });
            } else {
                await this.reportPostRepository.save(createPostReportDto);
            }
            return { status: "success" };
        } catch (err) {
            return { message: "report post fail, please try again" };
        }
    }

    async updateUserInterest(userInterestDto: CreateUserInterestDto): Promise<any> {
        const findData = { userId: userInterestDto.userId };
        await this.userInterestRepository.delete(findData);
        const createUserInterestDto = [];
        for (const i of userInterestDto.interest.split(",")) {
            createUserInterestDto.push({ userId: userInterestDto.userId, interestId: i, createdAt: new Date(), updatedAt: new Date() });
        }
        await this.saveUserInterest(createUserInterestDto);
        const interest = await this.userInterestRepository.find(findData);
        return { status: "success", interest: interest };
    }

    async deletePostInterest(id: number): Promise<any> {
        const findData = { postId: id };
        const postInterestRepo = getRepository(PostInterest);
        return await postInterestRepo.delete(findData);
    }

    async updateUserTag(id: number, status: string): Promise<any> {
        try {

            await this.postUserTagRepository.update(id, { taggedStatus: status });
            return { status: "success", message: 'Update post tag success' };
        } catch (err) {
            return { message: "Delete post fail, please try again" };
        }
    }

}