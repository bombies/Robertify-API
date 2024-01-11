import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {
    PremiumGuildSchema,
    PremiumUserSchema
} from "./payments.schema";
import {PaymentsController} from "./payments.controller";
import {PaymentsService} from "./payments.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'premium_users',
                schema: PremiumUserSchema
            },
            {
                name: 'premium_guilds',
                schema: PremiumGuildSchema
            },
        ]),
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
    exports: [PaymentsService]
})
export class PaymentsModule {
}