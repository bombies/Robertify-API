import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraintInterface} from "class-validator";

export const IsDedicatedChannel = (validationOptions?: ValidationOptions): PropertyDecorator => {
    return (object: Object, propName: string) => {
        registerDecorator({
            name: 'isDedicatedChannel',
            target: object.constructor,
            propertyName: propName,
            options: validationOptions,
            validator: {
                validate(value: any, validationArguments?: ValidationArguments) {
                    return typeof value === 'object' && value.message_id !== undefined
                    && value.channel_id !== undefined && typeof value.message_id === 'number'
                    && typeof value.channel_id === 'number';
                }
            }
        })
    }
}