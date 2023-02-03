import {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type CommandDocument = HydratedDocument<Command>;

@Schema()
export class Command {
    @Prop()
    id: number;

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    category: string;
}

const CommandSchema = SchemaFactory.createForClass(Command);