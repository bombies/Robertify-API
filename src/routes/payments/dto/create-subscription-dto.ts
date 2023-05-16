import {IsArray, IsBoolean, IsIn, IsNotEmpty, IsObject, IsOptional, IsString, Length} from "class-validator";

export class CreateSubscriptionDto {
    /**
     * The ID of the product created through Catalog Products API.
     */
    @IsNotEmpty()
    @IsString()
    @Length(6, 50)
    product_id: string

    /**
     * The plan name.
     */
    @IsNotEmpty()
    @IsString()
    @Length(1,127)
    name: string

    /**
     * The initial state of the plan. Allowed input values are CREATED and ACTIVE.
     */
    @IsOptional()
    @IsString()
    @IsIn(['ACTIVE', 'INACTIVE', 'CLOSED'])
    status?: string;

    /**
     * The plan description.
     */
    @IsOptional()
    @IsString()
    @Length(1, 127)
    description?: string;

    /**
     * An array of billing cycles for trial billing and regular billing. A plan
     * can have at most two trial cycles and only one regular cycle.
     */
    @IsArray()
    billing_cycles: SubscriptionBillingCycle[];

    /**
     * Indicates whether you can subscribe to this plan by providing a quantity
     * for the goods or service.
     */
    @IsBoolean()
    @IsOptional()
    quantity_supported?: boolean;

    /**
     * The payment preferences for a subscription.
     */
    @IsObject()
    @IsNotEmpty()
    payment_preferences: SubscriptionPaymentPreferences

    @IsObject()
    @IsOptional()
    taxes?: SubscriptionTaxes
}

/**
 * Billing cycle for trial billing and regular billing. A plan can have at most
 * two trial cycles and only one regular cycle.
 */
type SubscriptionBillingCycle = {
    /**
     * The tenure type of the billing cycle. In case of a plan having trial cycle,
     * only 2 trial cycles are allowed per plan.
     *
     * Can either be `REGULAR` or `TRIAL`.
     */
    tenure_type: string,
    /**
     * The order in which this cycle is to run among other billing cycles. For example,
     * a trial billing cycle has a `sequence` of `1` while a regular billing cycle has a
     * `sequence` of `2`, so that trial cycle runs before the regular cycle.
     */
    sequence: number,
    /**
     * The number of times this billing cycle gets executed. Trial billing cycles can only
     * be executed a finite number of times (value between 1 and 999 for total_cycles).
     * Regular billing cycles can be executed infinite times (value of 0 for total_cycles)
     * or a finite number of times (value between 1 and 999 for total_cycles).
     */
    total_cycles: number,
    /**
     * The active pricing scheme for this billing cycle. A free trial billing
     * cycle does not require a pricing scheme.
     */
    pricing_scheme: SubscriptionPricingScheme,
    /**
     * The frequency details for this billing cycle.
     */
    frequency: SubscriptionFrequency,
}

/**
 * The active pricing scheme for this billing cycle.
 * A free trial billing cycle does not require a pricing scheme.
 */
type SubscriptionPricingScheme = {
    /**
     * The pricing model for tiered plan. The tiers parameter is required.
     * The pricing model can either be `VOLUME` or `TIERED`.
     */
    pricing_model: string
    /**
     * An array of pricing tiers which are used for billing volume/tiered
     * plans. pricing_model field has to be specified.
     */
    tiers: SubscriptionPricingSchemeTier[]
    /**
     * The fixed amount to charge for the subscription. The changes to fixed
     * amount are applicable to both existing and future subscriptions. For
     * existing subscriptions, payments within 10 days of price change are
     * not affected.
     */
    fixed_price: SubscriptionPricingAmount
}

/**
 * Pricing tiers which is used for billing volume/tiered plans.
 * pricing_model field has to be specified.
 */
type SubscriptionPricingSchemeTier = {
    /**
     * The starting quantity for the tier.
     */
    starting_quantity: number
    /**
     * The ending quantity for the tier. Optional for the last tier.
     */
    ending_quantity: number
    /**
     * The pricing amount for the tier.
     */
    amount: SubscriptionPricingAmount
}

type SubscriptionPricingAmount = {
    /**
     * The three-character ISO-4217 currency code that identifies the currency.
     */
    currency_code: string
    value: string
}

type SubscriptionFrequency = {
    /**
     * The interval at which the subscription is charged or billed.
     * The intervals can be: DAY, WEEK, MONTH, and YEAR.
     */
    interval_unit: string
    interval_count: number
}

/**
 * The payment preferences for a subscription.
 */
type SubscriptionPaymentPreferences = {
    /**
     * Indicates whether to automatically bill the outstanding amount
     * in the next billing cycle.
     */
    auto_bill_outstanding: boolean
    /**
     * The action to take on the subscription if the initial payment for the setup fails.
     * Options include: CONTINUE, CANCEL. Default is CANCEL.
     */
    setup_fee_failure_action: string
    /**
     * The maximum number of payment failures before a subscription is suspended. For example,
     * if payment_failure_threshold is 2, the subscription automatically updates to the SUSPEND
     * state if two consecutive payments fail.
     */
    payment_failure_threshold: number
    /**
     * The initial set-up fee for the service.
     */
    setup_fee: SubscriptionPricingAmount
}

/**
 * The tax details.
 */
type SubscriptionTaxes = {
    /**
     * Indicates whether the tax was already included in the billing amount.
     */
    inclusive: boolean
    /**
     * The tax percentage on the billing amount.
     */
    percentage: string
}