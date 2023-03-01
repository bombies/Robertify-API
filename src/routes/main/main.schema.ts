import {HydratedDocument, Types} from "mongoose";
import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";

export type MainDocument = HydratedDocument<MainDatabaseDocument>;

@Schema()
export class MainDatabaseDocument {
    @Prop()
    random_messages: string[];

    @Prop()
    identifier: string;

    @Prop({ type: Object })
    reports: Object;

    @Prop(raw({
        alert_time: Number,
        alert: String
    }))
    latest_alert: { alert_time: number, alert: string };

    @Prop({ type: Array })
    developers: Types.Long[] | string[];

    @Prop({ type: Array })
    alert_viewers: Types.Long[] | string[];

    @Prop()
    last_booted: number;

    @Prop({ type: Object })
    suggestions: Object;

    @Prop()
    guild_count: number;
}

export const MainDocumentSchema = SchemaFactory.createForClass(MainDatabaseDocument);