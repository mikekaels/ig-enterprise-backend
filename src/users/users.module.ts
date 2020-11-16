import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../shared/entity/users.entity';
import { UsersController } from './users.controller';
import { BookMark } from '../shared/entity/bookmark.entity';
import { Post } from '../shared/entity/post.entity';
import { Blocked } from '../shared/entity/blocked.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Blocked, Post, User, BookMark])],
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController],
})
export class UsersModule { }