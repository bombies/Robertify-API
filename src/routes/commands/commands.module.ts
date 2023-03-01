import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import {MongooseModule} from "@nestjs/mongoose";
import {CommandSchema} from "./command.schema";
import { CommandsController } from './commands.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'commands', schema: CommandSchema }])],
  providers: [CommandsService],
  controllers: [CommandsController],
  exports: [CommandsService]
})
export class CommandsModule {}
