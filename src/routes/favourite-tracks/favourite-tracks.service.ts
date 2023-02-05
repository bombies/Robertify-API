import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {FavouriteTracksDocument} from "./favourite-tracks.schema";
import {Model, Types} from "mongoose";

@Injectable()
export class FavouriteTracksService {
    constructor(@InjectModel('favouritetracks') private readonly favouriteTracksModel: Model<FavouriteTracksDocument>) {}

    async findOne(user_id: string) {
        return this.favouriteTracksModel.findOne(({ user_id: Types.Long.fromString(user_id) })).exec();
    }
}
