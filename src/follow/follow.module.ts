import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module';
import { Follow } from '../shared/entity/follow.entity';
import { Favourite } from '../shared/entity/favourite.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Follow,Favourite])],
  controllers: [FollowController],
  exports: [FollowService],
  providers: [FollowService]
})
export class FollowModule { }
