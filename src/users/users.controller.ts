import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../shared/entity/users.entity';
import { CreateUserDto } from './dto/create-users.dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,

    ) { }

    @Get('load/:uid')
    async getUserById(@Param('uid') id: number): Promise<User> {
        return await this.usersService.findById(id);
    }

    @Get('search/username/:search/:uid')
    async searchUsers(@Param('search') search: string, @Param('uid') id: number): Promise<User[]> {
        return await this.usersService.searchUser(search, id);
    }

    @Get('share/search/:search/:uid')
    async searchShareUsers(@Param('search') search: string, @Param('uid') id: number): Promise<User[]> {
        return await this.usersService.searchShareUser(search, id);
    }

    @Get('load/profile/:uid')
    async loadProfile(@Param('uid') id: number): Promise<any> {
        return await this.usersService.loadProfile(id);
    }

    @Get('load/activity/:uid')
    async loadActivity(@Param('uid') id: number): Promise<any> {
        return await this.usersService.loadActivity(id);
    }

    @Get('profile/bookmark/:uid')
    async loadProfileBookMark(@Param('uid') id: number): Promise<any> {
        return await this.usersService.loadProfileBookMark(id);
    }

    @Post('update/secondary/email')
    async updateSecondaryEmail(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateSecondaryEmail(createUserDto.id, createUserDto.secondaryEmail);
    }

    @Post('update/username')
    async updateUsername(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateUsername(createUserDto.id, createUserDto.username);
    }
    
    @Post('update/fullname')
    async updateFullname(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateFullname(createUserDto.id, createUserDto.fullname);
    }

    @Post('update/bio')
    async updateBIO(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateBIO(createUserDto.id, createUserDto.bio);
    }

    @Post('update/website')
    async updateWebsite(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateWebsite(createUserDto.id, createUserDto.website);
    }

    @Post('update/gender')
    async updateGender(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateGender(createUserDto.id, createUserDto.gender);
    }

    @Post('update/location')
    async updateLocation(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.usersService.updateLocation(createUserDto.id, createUserDto.city);
    }

    @Post('update/dob')
    async updateDOB(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateDOB(createUserDto.id, createUserDto.dob);
    }

    @Post('update/profile/image')
    async updateProfileImage(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateProfileImage(createUserDto.id, createUserDto.profileImageURL200X200, 
            createUserDto.profileImageURL600X600, createUserDto.profileImageURL1080X1080);
    }

    @Post('update/private/account')
    async updatePrivateAccount(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updatePrivateAccount(createUserDto.id, createUserDto.accountType);
    }

    @Post('update/tagged')
    async updateTagged(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateTagged(createUserDto.id, createUserDto.tagged);
    }

    @Post('update/replies')
    async updateReplies(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateReplies(createUserDto.id, createUserDto.replies);
    }

    @Post('update/auto/save/post')
    async updateAutoSavePost(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateAutoSavePost(createUserDto.id, createUserDto.autoSavePost);
    }

    @Post('update/notification')
    async updateNotification(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateNotification(createUserDto.id, createUserDto.newMessage, 
            createUserDto.newFollowerRequest, createUserDto.taggedInPost, createUserDto.adminEmail, createUserDto.adminPush);
    }

    @Post('update/password')
    async updatePassword(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updatePassword(createUserDto.id, createUserDto.password, createUserDto.currentPassword);
    }

    @Post('update/fuid')
    async updateUID(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.usersService.updateUID(createUserDto.id, createUserDto.fuid);
    }
    
    @Get('find/firebase/:uid')
    async getFirebaseUser(@Param('uid') id: string): Promise<User> {
        return await this.usersService.getFirebaseUser(id);
    }
    
}
