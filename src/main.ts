import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import {AxiosErrorFilter} from "./exceptions/axios-error.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AxiosErrorFilter());
  await app.listen(Number(process.env.PORT));
}
bootstrap();
