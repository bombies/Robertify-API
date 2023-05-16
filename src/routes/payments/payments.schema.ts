import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

@Schema()
export class PremiumUser {
  @Prop()
  discord_id: string;

  @Prop()
  premium_id: string;

  @Prop()
  premium_started: number;

  @Prop()
  premium_ends: number;
}

export class PremiumGuild {
  @Prop()
  guild_id: string;

  @Prop()
  set_by: string

  @Prop()
  premium_started: number;

  @Prop()
  premium_ends: number;
}

export type PremiumUserDocument = HydratedDocument<PremiumUser>;
export type PremiumGuildDocument = HydratedDocument<PremiumGuild>;

export const PremiumUserSchema = SchemaFactory.createForClass(PremiumUser);
export const PremiumGuildSchema = SchemaFactory.createForClass(PremiumGuild);