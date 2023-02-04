import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import {MongooseModule} from "@nestjs/mongoose";
import {CommandSchema} from "./command.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: 'commands', schema: CommandSchema }])],
  providers: [CommandsService],
  controllers: [],
  exports: [CommandsService]
})
export class CommandsModule {}
