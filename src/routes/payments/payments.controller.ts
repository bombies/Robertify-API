import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {PaymentsService} from "./payments.service";
import {CreateProductDto} from "./dto/create-product-dto";
import {CreatePlanDto} from "./dto/create-plan-dto";

@Controller('payments')
export class PaymentsController {

    constructor(private readonly paymentsService: PaymentsService) {
    }

    @Post('products')
    async createProduct(@Body() createProductDto: CreateProductDto) {
        return this.paymentsService.createProduct(createProductDto);
    }

    @Get('products')
    async findAllProducts() {
        return this.paymentsService.findAllProducts();
    }

    @Get('products/:id')
    async findProduct(@Param("id") id: string) {
        return this.paymentsService.findProduct(id);
    }

    @Post('plans')
    async createSubscription(@Body() createPlanDto: CreatePlanDto) {
        return this.paymentsService.createPlan(createPlanDto);
    }

    @Get('plans')
    async findAllPlans() {
        return this.paymentsService.findAllPlans();
    }

    @Get('plans/:id')
    async findPlan(@Param("id") id: string) {
        return this.paymentsService.findPlan(id);
    }

    @Post('plans/:id/deactivate')
    async deactivatePlan(@Param("id") id: string) {
        return this.paymentsService.deactivatePlan(id);
    }

}