import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // , { cors: true }

  const options = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: "Content-Type, Accept",
  };

  admin.initializeApp({
    credential: admin.credential.cert('./ig-ian-firebase-adminsdk-iyv85-47e0a0f657.json'),
    databaseURL: "https://ig-ian.firebaseio.com"
  });

  app.enableCors(options);

  await app.listen(process.env.PORT || 3030);
}
bootstrap();
