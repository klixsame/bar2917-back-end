import { EnumOrderStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class OrderDto {
    @IsOptional()
    @IsEnum(EnumOrderStatus)
    status: EnumOrderStatus

    @IsString()
    address: string

    @IsOptional()
    @IsString()
    commentary: string

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
}

export class OrderItemDto {
    @IsNumber()
    quantity: number

    @IsNumber()
    price: number

    @IsNumber()
    productId: number
}