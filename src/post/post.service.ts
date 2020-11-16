import { Injectable } from '@nestjs/common';
import { Post, Status } from '../shared/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions, getRepository } from 'typeorm';
import { PostDto } from './dto/post.dto';
import { User } from '../shared/entity/users.entity';
import * as moment from 'moment';
import { SettingService } from '../setting/setting.service';
import { CreatePostShareDto } from './dto/create-post-share.dto';
import { Share } from '../shared/entity/share.entity';
import { CreatePostReportDto } from '../setting/dto/create-post-report.dto';
import { Report } from '../shared/entity/report.entity';
import { ReportPost } from '../shared/entity/report_post.entity';
import { PostUserTag } from '../shared/entity/post_user_tag.entity';

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly settingService: SettingService,
        @InjectRepository(Share)
        private readonly shareRepository: Repository<Share>,
    ) { }

    async save(postDto: PostDto, user: User): Promise<any> {
        try {
            let post = new Post();
            post.content = postDto.content;
            post.createdAt = postDto.createdAt == null ? new Date() : moment(postDto.createdAt).toDate();
            post.imageURL1080x1080 = postDto.imageURL1080x1080;
            post.imageURL200x200 = postDto.imageURL200x200;
            post.imageURL600x600 = postDto.imageURL600x600;
            post.promotion = postDto.promotion;
            post.editedImage = postDto.editedImage;
            post.status = Status.ACTIVE;
            post.updatedAt = postDto.updatedAt == null ? new Date() : moment(postDto.updatedAt).toDate();
            post.user = user;
            post = await this.postRepository.save(post);
            console.log(postDto);
            if (postDto.interest != null) {
                const createPostDto = [];
                for (const i of postDto.interest) {
                    createPostDto.push({ postId: post.id, interestId: i, createdAt: postDto.createdAt });
                }
                await this.settingService.savePostInterest(createPostDto);
            }
            if (postDto.userTag != null) {
                const createPostDto = [];
                for (const tag of postDto.userTag) {
                    createPostDto.push({ postId: post.id, userId: tag.id, taggedStatus: tag.taggedStatus, createdAt: postDto.createdAt });
                }
                await this.settingService.savePostUserTag(createPostDto);
            }
            if (postDto.content.includes('#')) {
                const createPostDto = [];
                const fArray = postDto.content.split(" ");
                for (const fSplit of fArray) {
                    if (fSplit.includes('#')) {
                        const sSplit = fSplit.split(/(?=#)/g); // split hash and following character
                        for (let text of sSplit) {
                            text = text.replace(/[`~!@$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); // remove all special character, but support other language word
                            if (text.includes('#') && text.length > 1) {
                                text = text.replace('#', '');
                                createPostDto.push({ postId: post.id, text: text, post: [post], createdAt: postDto.createdAt, updatedAt: postDto.updatedAt });
                            }
                        }
                    }
                }
                await this.settingService.savePostHashTag(createPostDto);
            }
            return { status: "success" };
        } catch (err) {
            return { message: "create post fail, please try again" };
        }
    }

    async saveShare(createPostShareDto: CreatePostShareDto, post: Post): Promise<any> {
        try {
            if (createPostShareDto.share != null) {
                const createPostDto = [];
                for (const i of createPostShareDto.share.split(",")) {
                    createPostShareDto.createdAt = createPostShareDto.createdAt == null ? new Date() : createPostShareDto.createdAt;
                    createPostDto.push({ userShareId: createPostShareDto.userId, postId: createPostShareDto.postId, userId: i, createdAt: createPostShareDto.createdAt, post: [post] });
                }
                await this.shareRepository.save(createPostDto);
            }
            return { status: "success" };
        } catch (err) {
            return { message: "share post fail, please try again" };
        }
    }



    async findById(id: number): Promise<Post> {
        return await this.postRepository.findOne(id);
    }


    async find(id: number, followingId: number): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user")
            .leftJoinAndSelect("user.follower", "follower", "follower.followingId = :uid", {uid: followingId})
            .where("user.id = :id", { id: id })
            .andWhere("post.status = 'A'")
            .orderBy("post.createdAt", "DESC")
            .getMany();
    }

    async findPostDetailById(id: number, userId: number): Promise<any> {
        const posts = await getRepository(Post)
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user")
            .leftJoinAndSelect("user.follower", "follower", "follower.followingId = :uid", {uid: userId})
            .leftJoinAndSelect("post.userTag", "userTag")
            .leftJoinAndSelect("post.interestTag", "interestTag")
            .leftJoinAndSelect("post.bookMark", "bookMark", "bookMark.userId = :userId", {userId: userId})
            .where("post.id = :id", { id: id })
            .andWhere("post.status = 'A'")
            .getMany();
         const userTag = await getRepository(PostUserTag)
            .createQueryBuilder("userTag")
            .where("userTag.postId = :id", { id: id })
            .getMany();
        return { posts: posts, userTag: userTag };
    }

    async findAll(id: number): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user")
            .leftJoinAndSelect("post.userTag", "userTag")
            .leftJoinAndSelect("userTag.follower", "follower")
            .leftJoinAndSelect("post.interestTag", "interestTag")
            .leftJoinAndSelect("post.bookMark", "bookMark")
            // .leftJoinAndSelect("user.following", "following")
            .where("user.id != :id", { id: id })
            .andWhere("post.status = 'A'")
            .orderBy("post.createdAt", "DESC")
            // .skip(0)
            // .take(3)
            .getMany();
    }

    async loadActivity(id: number, pageCount: number): Promise<Post[]> {
        const skip = pageCount > 0 ? pageCount : 0;
      const count = pageCount + 2;
        return await getRepository(Post)
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user", "user.status = 'A'")
            .leftJoinAndSelect("user.following", "following", "following.status = 'A'")
            .leftJoinAndSelect("following.follower", "follower", "follower.status = 'A'")
            .where("user.id = :id", { id: id })
            .andWhere("post.status = 'A'")
            .orderBy("post.createdAt", "DESC")
            .skip(0)
            .take(2)
            .getMany();
    }

    async findAllPost(): Promise<Post[]> {
        return this.postRepository.find();
    }

    async findAllInterestTagPost(id: number): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user")
            .leftJoinAndSelect("post.interestTag", "interestTag")
            .where("interestTag.id = :id", { id: id })
            .getMany();
    }

    async findAllHashTagPost(text: string): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user")
            .leftJoinAndSelect("user.follower", "follower")
            .leftJoinAndSelect("post.hashTag", "hashTag")
            .where("hashTag.text = :text", { text: text })
            .getMany();
    }

    async findAllShareByPostId(id: number): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user")
            .leftJoinAndSelect("post.share", "share")
            .where("share.postId = :id", { id: id })
            .getMany();
    }


    async delete(id: number): Promise<any> {
        try {
            await this.postRepository.update(id, { status: Status.DELETE, updatedAt: new Date() });
            return { status: "success", message: 'Delete post success'};
        } catch (err) {
            return { message: "Delete post fail, please try again" };
        }
    }

    async update(postDto: PostDto): Promise<any> {
        try {
        await this.postRepository.update(postDto.id, {content: postDto.content, promotion: postDto.promotion,
             editedImage: postDto.editedImage, updatedAt: postDto.updatedAt});
             if (postDto.interest != null) {
                await this.settingService.deletePostInterest(postDto.id);
                const createPostDto = [];
                for (const i of postDto.interest) {
                    createPostDto.push({ postId: postDto.id, interestId: i, createdAt: postDto.createdAt });
                }
                await this.settingService.savePostInterest(createPostDto);
            }
            if (postDto.userTag != null) {
                const createPostDto = [];
                for (const tag of postDto.userTag) {
                    createPostDto.push({ postId: postDto.id, userId: tag.id, taggedStatus: tag.taggedStatus, createdAt: postDto.createdAt });
                }
                await this.settingService.savePostUserTag(createPostDto);
            }
            if (postDto.content.includes('#')) {
                const createPostDto = [];
                const fArray = postDto.content.split(" ");
                for (const fSplit of fArray) {
                    if (fSplit.includes('#')) {
                        const sSplit = fSplit.split(/(?=#)/g); // split hash and following character
                        for (let text of sSplit) {
                            text = text.replace(/[`~!@$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); // remove all special character, but support other language word
                            if (text.includes('#') && text.length > 1) {
                                text = text.replace('#', '');
                                createPostDto.push({ postId: postDto.id, text: text, post: [postDto], createdAt: postDto.createdAt, updatedAt: postDto.updatedAt });
                            }
                        }
                    }
                }
                await this.settingService.savePostHashTag(createPostDto);
            }

            return { status: "success", message: "Update post success"};
        } catch (err) {
            return { message: "Update post fail, please try again" };
        }

    }

}
