import { Prisma } from "@prisma/client"
import { Type } from "class-transformer"
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"

export class ProductLocationDto {
    @IsNumber()
    locationId: number

    @IsNumber()
    price: number
}

export class ProductDto implements Prisma.ProductUpdateInput {
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description: string

    @IsString()
    image: string

    @IsNumber()
    weight: number

    @IsBoolean()
    isActive: boolean

    @IsNumber()
    categoryId: number

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ProductLocationDto)
    items: ProductLocationDto[]
}
