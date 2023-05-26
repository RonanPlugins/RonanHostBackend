import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    rawBody: true,
  });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://ronanhost.com',
      'https://www.ronanhost.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('RonanHost API')
    .setDescription('API for RonanHost')
    .setVersion(process.env.npm_package_version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.APPLICATION_PORT);
}

bootstrap();
