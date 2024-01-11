import {PlanPricingScheme} from "./create-plan-dto";
import {IsArray} from "class-validator";

export class UpdatePlanPricingDto {
    @IsArray()
    pricing_schemes: {
        billing_cycle_sequence: number;
        pricing_scheme: PlanPricingScheme
    }[]
}