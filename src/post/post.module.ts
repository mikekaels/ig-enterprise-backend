import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UsersModule } from '../users/users.module';
import { Post } from '../shared/entity/post.entity';
import { FollowModule } from '../follow/follow.module';
import { SettingModule } from '../setting/setting.module';
import { PostUserTag } from '../shared/entity/post_user_tag.entity';
import { Share } from '../shared/entity/share.entity';
import { Report } from '../shared/entity/report.entity';

@Module({
    imports: [UsersModule, FollowModule, SettingModule, TypeOrmModule.forFeature([Report, Share, Post, PostUserTag])],
    providers: [PostService],
    exports: [PostService],
    controllers: [PostController],

})
export class PostModule {}
