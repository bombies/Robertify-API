import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {FavouriteTracksDocument} from "./favourite-tracks.schema";
import {Model} from "mongoose";

@Injectable()
export class FavouriteTracksService {
    constructor(@InjectModel('favouritetracks') private readonly favouriteTracksModel: Model<FavouriteTracksDocument>) {}

    findOne(user_id: number) {
        return this.favouriteTracksModel.findOne(({ user_id: user_id })).exec();
    }
}
