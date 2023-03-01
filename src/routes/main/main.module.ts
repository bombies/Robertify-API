import { Module } from '@nestjs/common';
import { MainService } from './main.service';
import {MongooseModule} from "@nestjs/mongoose";
import {MainDocumentSchema} from "./main.schema";
import { MainController } from './main.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'main', schema: MainDocumentSchema}])],
  providers: [MainService],
  controllers: [MainController],
  exports: [MainService]
})
export class MainModule {}
