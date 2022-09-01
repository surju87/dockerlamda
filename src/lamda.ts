import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as serverlessExpress from '@vendia/serverless-express';
import { Context, Handler } from 'aws-lambda';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.enableCors();
    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await nestApp.init();

    cachedServer = serverlessExpress.configure({ app: expressApp });
  }

  return cachedServer;
}

export const handler = async (event: any, context: Context, callback: any) => {
  const server = await bootstrap();
  return server(event, context, callback);
};