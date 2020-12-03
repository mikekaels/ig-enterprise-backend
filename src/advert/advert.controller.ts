import { Controller, Get, Post, Req, Res, UseGuards, Body } from '@nestjs/common';
import { User } from '../shared/entity/users.entity';
import { UsersService } from '../users/users.service';
import { AdvertService } from './advert.service';
import { AdvertDto } from './dto/advert.dto';
import { City } from '../shared/entity/city.entity';
import { HashTag } from 'src/shared/entity/hashtag.entity';

@Controller('advert')
export class AdvertController {
    constructor(
        private usersService: UsersService,
        private advertService: AdvertService,
    ) { }

    @Post('create')
    async createAdvert(@Body() advertDto: AdvertDto): Promise<any> {
        let user = new User();
        user = await this.usersService.findById(advertDto.uid);
        return await this.advertService.createAdvert(advertDto, user);
    }

    @Get('cities')
    async gettAllCity(): Promise<City[]> {
        return await this.advertService.findAllCity();
    }

    @Post('users')
    async gettAllUser(@Body('search') search): Promise<User[]> {
        return await this.advertService.findAllUser(search);
    }

    @Post('hastag')
    async getAllHastag(@Body('search') search): Promise<HashTag[]> {
        return await this.advertService.findAllHastag(search);
    }
}
