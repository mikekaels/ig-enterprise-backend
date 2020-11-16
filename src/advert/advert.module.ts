import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Advert } from '../shared/entity/advert.entity';
import { AdvertController } from './advert.controller';
import { AdvertService } from './advert.service';
import { SettingModule } from '../setting/setting.module';
import { UsersModule } from '../users/users.module';
import { Post } from '../shared/entity/post.entity';

@Module({
  imports: [UsersModule, SettingModule, TypeOrmModule.forFeature([Advert, Post])],
  controllers: [AdvertController],
  providers: [AdvertService],
  exports: [AdvertService],
})
export class AdvertModule {}
