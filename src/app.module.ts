import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import * as dotenv from 'dotenv';
dotenv.config();

import { StripeModule } from 'nestjs-stripe';
import { FollowersController } from './followers/followers.controller';
import { FollowersService } from './followers/followers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { FollowersModule } from './followers/followers.module';
import { AuthModule } from './auth/auth.module';
import { FollowModule } from './follow/follow.module';
import { PostModule } from './post/post.module';
import { SettingModule } from './setting/setting.module';
import { UsersModule } from './users/users.module';
import { AdvertModule } from './advert/advert.module';

@Module({
  imports: [
    PaymentModule,
    StripeModule.forRoot({
      // apiKey: process.env.STRIPE_SECRET_KEY,
      apiKey: 'sk_test_51HZ1N8BJBXDtpMAEwvOeDGKKGsC2ZNk3qjLucvdaJZs6PonVvlt26WhllH1K0fyeQvQ5eIjKly56WYSuYFdc9SrG00w6BuqsKU',
      apiVersion: '2020-08-27'
    }),
    TypeOrmModule.forRoot(config),
    // FollowersModule,
    AuthModule,
    UsersModule,
    SettingModule,
    PostModule,
    FollowModule,
    AdvertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
