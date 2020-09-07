import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import * as dotenv from 'dotenv';
dotenv.config();

import { StripeModule } from 'nestjs-stripe';

@Module({
  imports: [
    PaymentModule,
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_SECRET_KEY,
      apiVersion: '2020-08-27'
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
