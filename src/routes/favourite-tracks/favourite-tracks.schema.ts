import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FavouriteTracksDocument = HydratedDocument<FavouriteTracks>;

@Schema()
export class FavouriteTracks {
  @Prop({ type: Types.Long })
  user_id: Types.Long | string;

  @Prop()
  tracks: any[];
}

export const FavouriteTracksSchema =
  SchemaFactory.createForClass(FavouriteTracks);
