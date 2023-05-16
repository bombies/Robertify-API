import {Body, Controller, Post} from "@nestjs/common";
import {PaymentsService} from "./payments.service";
import {CreateProductDto} from "./dto/create-product-dto";
import {CreateSubscriptionDto} from "./dto/create-subscription-dto";

@Controller('payments')
export class PaymentsController {

    constructor(private readonly paymentsService: PaymentsService) {
    }

    @Post('products')
    async createProduct(@Body() createProductDto: CreateProductDto) {
        return this.paymentsService.createProduct(createProductDto);
    }

    @Post('subscriptions')
    async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
        return this.paymentsService.createSubscription(createSubscriptionDto);
    }

}