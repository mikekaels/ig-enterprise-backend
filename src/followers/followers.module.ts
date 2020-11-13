import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Followers } from './followers.entity';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Followers
    ])
  ],
  exports: [FollowersService],
  providers: [FollowersService],
  controllers: [FollowersController]
})
export class FollowersModule { }
