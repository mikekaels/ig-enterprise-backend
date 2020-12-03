import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advert } from '../shared/entity/advert.entity';
import { AdvertController } from './advert.controller';
import { AdvertService } from './advert.service';
import { SettingModule } from '../setting/setting.module';
import { UsersModule } from '../users/users.module';
import { Post } from '../shared/entity/post.entity';
import { City } from 'src/shared/entity/city.entity';
import { User } from 'src/shared/entity/users.entity';
import { HashTag } from 'src/shared/entity/hashtag.entity';

@Module({
  imports: [UsersModule, SettingModule, TypeOrmModule.forFeature(
    [
      Advert,
      Post,
      City,
      User,
      HashTag
    ]
  )
  ],
  controllers: [AdvertController],
  providers: [AdvertService],
  exports: [AdvertService],
})
export class AdvertModule { }
