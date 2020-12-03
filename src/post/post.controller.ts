import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { UsersService } from '../users/users.service';
import { User } from '../shared/entity/users.entity';
import { Post as Posts } from '../shared/entity/post.entity';
import { FollowService } from '../follow/follow.service';
import { CreatePostHashTagDto } from '../setting/dto/create-post-hash-tag.dto';
import { SettingService } from '../setting/setting.service';
import { HashTag } from '../shared/entity/hashtag.entity';
import { CreateBookMarkDto } from '../users/dto/create-bookmark.dto';
import { CreatePostShareDto } from './dto/create-post-share.dto';
import { CreatePostUserTagDto } from '../setting/dto/create-post-user-tag.dto';

@Controller('post')
export class PostController {
    constructor(
        private postService: PostService,
        private usersService: UsersService,
        private followService: FollowService,
        private settingService: SettingService,

    ) { }

    @Post('save')
    async save(@Body() postDto: PostDto): Promise<any> {
        let user = new User();
        user = await this.usersService.findById(postDto.uid);
        return await this.postService.save(postDto, user);
    }

    @Post('update')
    async update(@Body() postDto: PostDto): Promise<any> {
        console.log(postDto);
        return await this.postService.update(postDto);
        // return {'status': 'success'};
    }

    @Get('load/uid/:uid/:fid')
    async getPostByUserId(@Param('uid') id: number, @Param('fid') fid: number): Promise<Posts[]> {
        return await this.postService.find(id, fid);
    }

    @Get('load/all/:uid')
    async loadAll(@Param('uid') id: number): Promise<Posts[]> {
        return await this.postService.findAll(id);
    }

    @Get('load/activity/:uid/:pageCount')
    async loadActivity(@Param('uid') id: number, @Param('pageCount') pageCount: number): Promise<any> {
        return await this.postService.loadActivity(id, pageCount);
    }

    @Get('load/following/:uid')
    async loadFollowing(@Param('uid') id: number): Promise<any> {
        return await this.followService.findFollowingPost(id);
    }

    @Post('create/post/hash/tag')
    async createPostHashTag(): Promise<any> {
        const createPostUserTagDto = new CreatePostHashTagDto();
        createPostUserTagDto.postId = 9;
        let post = new Posts();
        post = await this.postService.findById(9);
        createPostUserTagDto.text = '#coffee,#coffee,#coffee,#orange,#food,#water,#ice,#icecream,#coke,#rice,#milk';
        const createPostInterestDtoArray = [];
        for (const i of createPostUserTagDto.text.split(",")) {
            createPostInterestDtoArray.push({ postId: createPostUserTagDto.postId, text: i, post: [post], createdAt: new Date(), updatedAt: new Date() });
        }

        return await this.settingService.savePostHashTag(createPostInterestDtoArray);
    }


    @Get('search/hash/tag/:search')
    async findPostUserTag(@Param('search') search: string): Promise<HashTag[]> {
        return await this.settingService.searchHashTag(search);
    }

    @Get('find/all/hash/tag/:search')
    async findPostHashTag(@Param('search') search: string): Promise<Posts[]> {
        return await this.postService.findAllHashTagPost('#'+search);
    }

    @Get('find/:id')
    async findPostById(@Param('id') id: number): Promise<Posts> {
        return await this.postService.findById(id);
    }

    @Get('find/all/interest/tag/:id')
    async findAllInterestTagPost(@Param('id') id: number): Promise<Posts[]> {
        return await this.postService.findAllInterestTagPost(id);
    }

    @Post('save/bookmark')
    async saveBookMark(@Body() createBookMarkDto: CreateBookMarkDto): Promise<any> {
        // let post = new Posts();
        // post = await this.postService.findById(createBookMarkDto.postId);
        // createBookMarkDto.post = [post];
        return await this.usersService.saveBookMark(createBookMarkDto);
    }

    @Post('remove/bookmark')
    async removeBookMark(@Body() createBookMarkDto: CreateBookMarkDto): Promise<any> {
        return await this.usersService.removeBookMark(createBookMarkDto);
    }

    @Post('delete')
    async delete(@Body() id: number): Promise<any> {
        return await this.postService.delete(id);
    }

    @Post('save/share')
    async saveShare(@Body() createPostShareDto: CreatePostShareDto): Promise<any> {
        let post = new Posts();
        post = await this.postService.findById(createPostShareDto.postId);
        return await this.postService.saveShare(createPostShareDto, post);
    }

    @Post('update/user/tag')
    async updateUserTag(@Body() createPostUserTagDto: CreatePostUserTagDto): Promise<any> {
        return await this.settingService.updateUserTag(createPostUserTagDto.id, createPostUserTagDto.taggedStatus);
    }

    @Get('find/share/postid/:id')
    async findAllShareByPostId(@Param('id') id: number): Promise<Posts[]> {
        return await this.postService.findAllShareByPostId(id);
    }
    
    @Get('find/detail/:id/:uid')
    async findPostDetailById(@Param('id') id: number,@Param('uid') uid: number): Promise<any> {
        return await this.postService.findPostDetailById(id, uid);
    }
    
}
