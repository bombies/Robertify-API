import { Module } from '@nestjs/common';
import { MainService } from './main.service';
import {MongooseModule} from "@nestjs/mongoose";
import {MainDocumentSchema} from "./main.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: 'main', schema: MainDocumentSchema}])],
  providers: [MainService],
  controllers: [],
  exports: [MainService]
})
export class MainModule {}
