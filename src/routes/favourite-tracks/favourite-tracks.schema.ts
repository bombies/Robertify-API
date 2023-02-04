import {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type FavouriteTracksDocument = HydratedDocument<FavouriteTracks>;

@Schema()
export class FavouriteTracks {
    @Prop()
    user_id: string;

    @Prop()
    tracks: any[];
}

export const FavouriteTracksSchema = SchemaFactory.createForClass(FavouriteTracks);