import {Body, Injectable, Param, Patch} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {PremiumGuildDocument, PremiumUserDocument} from "./payments.schema";
import {CreateProductDto} from "./dto/create-product-dto";
import {PayPalWebClient} from "../../utils/webclients/PayPalWebClient";
import {nanoid} from "nanoid";
import {CreatePlanDto} from "./dto/create-plan-dto";
import {CreateProductResponse} from "./dto/create-product-response";
import {CreatePlanResponse} from "./dto/create-plan-response";
import {UpdatePlanPricingDto} from "./dto/update-plan-pricing-dto";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class PaymentsService {

    constructor(
        @InjectModel('premium_users') private readonly premiumUserModel: Model<PremiumUserDocument>,
        @InjectModel('premium_guilds') private readonly premiumGuildsModel: Model<PremiumGuildDocument>,
        private readonly httpService: HttpService
    ) {
    }

    async createProduct(dto: CreateProductDto) {
        const webClient = PayPalWebClient.getInstance();
        const response = await webClient.post<CreateProductResponse>("/v1/catalogs/products", {
            id: nanoid(6),
            ...dto
        });
        return response.data;
    }

    async createPlan(dto: CreatePlanDto) {
        const webClient = PayPalWebClient.getInstance();
        const response = await webClient.post<CreatePlanResponse>("/v1/billing/plans", dto);
        return response.data
    }

    async findProduct(id: string) {
        const webClient = PayPalWebClient.getInstance();
        const response = await webClient.get(`/v1/catalogs/products/${id}`);
        return response.data;
    }

    async findPlan(id: string) {
        const webClient = PayPalWebClient.getInstance();
        const response = await webClient.get(`/v1/billing/plans/${id}`);
        return response.data;
    }

    async findAllProducts() {
        const webClient = PayPalWebClient.getInstance();
        const response = await webClient.get("/v1/catalogs/products");
        return response.data;
    }

    async findAllPlans() {
        const webClient = PayPalWebClient.getInstance();
        const response = await webClient.get("/v1/billing/plans");
        return response.data;
    }

    async deactivatePlan(id: string) {
        const webClient = PayPalWebClient.getInstance();
        const response = await webClient.post(`/v1/billing/plans/${id}/deactivate`);
        return response.data;
    }

    @Patch('plans/:id/pricing')
    async updatePlanPricing(@Param("id") id: string, @Body() dto: UpdatePlanPricingDto){
        const webClient = PayPalWebClient.getInstance();
        const response = await webClient.patch(`/v1/billing/plans/${id}/update-pricing-schemes`, dto);
        return response.data;
    }

}