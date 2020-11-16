import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { User } from '../shared/entity/users.entity';
import { UsersService } from '../users/users.service';
import { Follow } from '../shared/entity/follow.entity';
import { FavouriteDto } from './dto/favourite.dto';

@Controller('follow')
export class FollowController {

    constructor(
        private followService: FollowService,
        private usersService: UsersService,

    ) { }

    @Post('save')
    async save(@Body() followDto: FollowDto): Promise<any> {
        let user = new User();
        let follower = new User();
        let following = new User();
        user = await this.usersService.findById(followDto.uid);
        follower = await this.usersService.findById(followDto.followerId);
        following = await this.usersService.findById(followDto.followingId);
        return await this.followService.save(followDto, user, follower, following);
    }

    @Post('update')
    async update(@Body() followDto: FollowDto): Promise<any> {
        return await this.followService.update(followDto);
    }

    @Delete('uid/delete/:id/:uid')
    async deleteByUID(@Param('id') id: number, @Param('uid') uid: number): Promise<any> {
        let follower = new User();
        let following = new User();
        follower = await this.usersService.findById(id);
        following = await this.usersService.findById(uid);
        return await this.followService.deleteUID(follower, following);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<any> {
        return await this.followService.delete(id);
    }

    @Delete('remove/:id')
    async remove(@Param('id') id: number): Promise<any> {
        return await this.followService.remove(id);
    }

    @Delete('block/:id')
    async block(@Param('id') id: number): Promise<any> {
        return await this.followService.block(id);
    }

    @Get('find/blocked/:uid')
    async findBlocked(@Param('uid') id: number): Promise<any> {
        return await this.followService.findBlocked(id);
    }

    @Get('get/all/follow/:uid')
    async getAllFollowByUserId(@Param('uid') id: number): Promise<any> {
        const followers = await this.followService.findFollower(id);
        const followings = await this.followService.findFollowing(id);
        const requests = await this.followService.findRequests(id);
        return {followers: followers, followings: followings, requests: requests};
    }

    @Get('get/all/following/:uid/:luid')
    async getAllFollowingByUserId(@Param('uid') id: number, @Param('luid') luid: number): Promise<any> {
        // followers
        let followers = await this.followService.findFollower(id);
        let otherFollowers = await this.followService.findOtherFollower(luid);
        otherFollowers = otherFollowers.filter((data) => data.followingId != id);
        otherFollowers.push(...followers);
        followers = otherFollowers.filter((data, index, a) => a.findIndex((other) => other.followingId == 
        data.followingId)===index);
        followers.map((data) => data.followStatus = data.status == 'P' ? 'REQUESTED' : 
        data.followerId == luid && data.status == 'A' ? 'UNFOLLOW' : 'FOLLOW');

        // followings
        let followings = await this.followService.findFollowing(id);
        let otherFollowings = await this.followService.findOtherFollowing(luid);
        // remove follow 
        otherFollowings = otherFollowings.filter((data) => data.followerId != id);
        otherFollowings.push(...followings);
        // remove duplicate follows, and take only current login user follows for private account requests status
        followings = otherFollowings.filter((data, index, a) => a.findIndex((other) => other.followerId == 
        data.followerId)===index);
        followings.map((data) => data.followStatus = data.status == 'P' ? 'REQUESTED' : 
        data.followingId == luid && data.status == 'A' ? 'UNFOLLOW' : 'FOLLOW');

        return {followers: followers, followings: followings};
    }

    @Get('following/search/follows/:uid/:search/:luid')
    async searchFollowFollowing(@Param('uid') id: number, @Param('search') search: string, @Param('luid') luid: number): Promise<any> {
        let followings = await this.followService.searchFollowing(id, search);
        let otherFollowings = await this.followService.searchFollowFollowing(luid, search);
        otherFollowings = otherFollowings.filter((data) => data.followerId != id);
        otherFollowings.push(...followings);

        followings = otherFollowings.filter((data, index, a) => a.findIndex((other) => other.followerId == 
        data.followerId)===index);
        followings.map((data) => data.followStatus = data.status == 'P' ? 'REQUESTED' : 
        data.followingId == luid && data.status == 'A' ? 'UNFOLLOW' : 'FOLLOW');
        return {followings: followings};
    }

    @Get('follower/search/follows/:uid/:search/:luid')
    async searchFollowFollower(@Param('uid') id: number, @Param('search') search: string, @Param('luid') luid: number): Promise<any> {
        let followers = await this.followService.searchFollower(id, search);
        let otherFollowings = await this.followService.searchFollowFollower(luid, search);
        otherFollowings = otherFollowings.filter((data) => data.followingId != id);
        otherFollowings.push(...followers);

        followers = otherFollowings.filter((data, index, a) => a.findIndex((other) => other.followerId == 
        data.followerId)===index);
        followers.map((data) => data.followStatus = data.status == 'P' ? 'REQUESTED' : 
        data.followerId == luid && data.status == 'A' ? 'UNFOLLOW' : 'FOLLOW');
        return {followers: followers};
    }

    @Get('following/search/:uid/:search')
    async searchFollowing(@Param('uid') id: number, @Param('search') search: string): Promise<any> {
        const followings = await this.followService.searchFollowing(id, search);
        return {followings: followings};
    }

    @Get('follower/search/:uid/:search')
    async searchFollower(@Param('uid') id: number, @Param('search') search: string): Promise<any> {
        const followers = await this.followService.searchFollower(id, search);
        return {followers: followers};
    }

    @Get('requests/search/:uid/:search')
    async searchRequests(@Param('uid') id: number, @Param('search') search: string): Promise<any> {
        const requests = await this.followService.searchRequests(id, search);
        return {requests: requests};
    }

    @Post('update/fav')
    async addFav(@Body() followDto: FollowDto): Promise<any> {
        return await this.followService.updateFav(followDto);
    }

    @Delete('remove/fav/:id')
    async removeFav(@Param('id') id: number): Promise<any> {
        return await this.followService.removeFav(id);
    }

}
