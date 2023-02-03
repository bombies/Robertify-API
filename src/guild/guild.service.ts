import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {GuildDocument} from "./guild.schema";

@Injectable()
export class GuildService {
    constructor(@InjectModel('guilds') private guildModel: Model<GuildDocument>) {}

    async findOne(id: number) {
        return this.guildModel.findOne({ server_id: id }).exec();
    }

    async updateOne(id: number, updateGuildDto) {

    }

    async findAll() {
        // TO-DO look into API pagination
    }

}
