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

@Module({
  imports: [
    PaymentModule,
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_SECRET_KEY,
      apiVersion: '2020-08-27'
    }),
    TypeOrmModule.forRoot(config),
    FollowersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
