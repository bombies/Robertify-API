import { Module } from '@nestjs/common';
import {GuildService} from "./guild.service";
import {MongooseModule} from "@nestjs/mongoose";
import {GuildSchema} from "./guild.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'guilds', schema: GuildSchema }])],
    controllers: [],
    providers: [GuildService],
    exports: [GuildService]
})
export class GuildModule {}
