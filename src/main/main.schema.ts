import {HydratedDocument} from "mongoose";
import {Schema, SchemaFactory} from "@nestjs/mongoose";

export type MainDocument = HydratedDocument<MainDatabaseDocument>;

@Schema()
export class MainDatabaseDocument {
    random_messages: string[];
    identifier: string;
    reports: Object;
    latest_alert: { alert_time: number, alert: string };
    developers: number[];
    alert_viewers: number[];
    last_booted: number;
    suggestions: Object;
    guild_count: number;
}

export const MainDocumentSchema = SchemaFactory.createForClass(MainDatabaseDocument);