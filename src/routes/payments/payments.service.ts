import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {PremiumGuildDocument, PremiumUserDocument} from "./payments.schema";
import {CreateProductDto} from "./dto/create-product-dto";
import {PayPalWebClient} from "../../utils/webclients/PayPalWebClient";
import {nanoid} from "nanoid";
import {CreateSubscriptionDto} from "./dto/create-subscription-dto";

@Injectable()
export class PaymentsService {

    constructor(
        @InjectModel('premium_users') private readonly premiumUserModel: Model<PremiumUserDocument>,
        @InjectModel('premium_guilds') private readonly premiumGuildsModel: Model<PremiumGuildDocument>,
    ) {
    }

    async createProduct(dto: CreateProductDto) {
        const webClient = PayPalWebClient.getInstance();
        const response = await webClient.post("/v1/catalogs/products", {
            id: nanoid(6),
            ...dto
        });
        return response.data;
    }

    async createSubscription(dto: CreateSubscriptionDto) {
        const webClient = PayPalWebClient.getInstance();
        const response = await webClient.post("/v1/billing/plans", dto);
        return response.data;
    }
}