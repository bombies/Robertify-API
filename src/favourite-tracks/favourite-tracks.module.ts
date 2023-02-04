import { Module } from '@nestjs/common';
import { FavouriteTracksService } from './favourite-tracks.service';
import {MongooseModule} from "@nestjs/mongoose";
import {FavouriteTracksSchema} from "./favourite-tracks.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'favouritetracks', schema: FavouriteTracksSchema }])],
    providers: [FavouriteTracksService],
    controllers: [],
    exports: [FavouriteTracksService]
})
export class FavouriteTracksModule {}
