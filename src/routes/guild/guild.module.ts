import { Module } from '@nestjs/common';
import {GuildService} from "./guild.service";
import {MongooseModule} from "@nestjs/mongoose";
import {GuildSchema} from "./guild.schema";
import { GuildController } from './guild.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'guilds', schema: GuildSchema }])],
    controllers: [GuildController],
    providers: [GuildService],
    exports: [GuildService]
})
export class GuildModule {}
