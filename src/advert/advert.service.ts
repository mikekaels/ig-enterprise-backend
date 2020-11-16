import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, getRepository } from 'typeorm';
import { SettingService } from '../setting/setting.service';
import { Advert } from '../shared/entity/advert.entity';
import { Post, Status } from '../shared/entity/post.entity';
import { User } from '../shared/entity/users.entity';
import { AdvertDto } from './dto/advert.dto';
import * as moment from 'moment';

@Injectable()
export class AdvertService {
    constructor(
        @InjectRepository(Advert)
        private readonly advertRepository: Repository<Advert>,
        private readonly settingService: SettingService,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

    ) { }

    // temp to put the imageurl to other sample image
    // cloud storage url 
    // imageFileName = uid + timestamp
    // upload path = uid + /thumbnails_activity/ + imageFileName + 'jpg'
    // format to create the imageurl
    // var imageURL200x200 =
    //       'https://storage.googleapis.com/ig-ian.appspot.com/' +
    //           uid +
    //           '/thumbnails_activity/' +
    //           imageFileName +
    //           '_200x200.jpg';
    //   var imageURL600x600 =
    //       'https://storage.googleapis.com/ig-ian.appspot.com/' +
    //           uid +
    //           '/thumbnails_activity/' +
    //           imageFileName +
    //           '_600x600.jpg';
    //   var imageURL1080x1080 =
    //       'https://storage.googleapis.com/ig-ian.appspot.com/' +
    //           uid +
    //           '/thumbnails_activity/' +
    //           imageFileName +
    //           '_1080x1080.jpg';
    // after success upload image then can begin to create advert

    async createAdvert(advertDto: AdvertDto, user: User): Promise<any> {
        try {
            let post = new Post();
            post.createdAt = advertDto.createdAt == null ? new Date() : moment(advertDto.createdAt).toDate();
            post.imageURL1080x1080 = advertDto.imageURL1080x1080;
            post.imageURL200x200 = advertDto.imageURL200x200;
            post.imageURL600x600 = advertDto.imageURL600x600;
            post.promotion = advertDto.promotion;
            post.editedImage = advertDto.editedImage;
            post.status = Status.ACTIVE;
            post.updatedAt = advertDto.updatedAt == null ? new Date() : moment(advertDto.updatedAt).toDate();
            post.user = user;
            post = await this.postRepository.save(post);
            if (advertDto.interest != null) {
                const createPostDto = [];
                for (const i of advertDto.interest) {
                    createPostDto.push({ postId: post.id, interestId: i, createdAt: advertDto.createdAt });
                }
                await this.settingService.savePostInterest(createPostDto);
            }
            if (advertDto.userTag != null) {
                const createPostDto = [];
                for (const tag of advertDto.userTag) {
                    createPostDto.push({ postId: post.id, userId: tag.id, taggedStatus: tag.taggedStatus, createdAt: advertDto.createdAt });
                }
                await this.settingService.savePostUserTag(createPostDto);
            }

            let advert = new Advert();
            advert.budget = advertDto.budget;
            advert.city = advertDto.city;
            advert.createdAt = post.createdAt;
            advert.updatedAt = post.updatedAt;
            advert.fromTime = advertDto.fromTime;
            advert.toTime = advertDto.toTime;
            advert.maxAge = advertDto.maxAge;
            advert.minAge = advertDto.minAge;
            advert.gender = advertDto.gender;
            advert.timezone = advertDto.timezone;
            advert.status = Status.ACTIVE;
            advert.user = user;
            advert.post = post;
            const createUserInterestDto = [];
            for (const i of advertDto.interest.split(",")) {
                createUserInterestDto.push({ userId: user.id, interestId: i, createdAt: advertDto.createdAt, updatedAt: advertDto.updatedAt });
            }
            await this.settingService.saveAdvertInterest(createUserInterestDto);
            await this.advertRepository.save(advert);


        } catch (err) {
            return { message: "create advert fail, please try again" };
        }

    }
}
