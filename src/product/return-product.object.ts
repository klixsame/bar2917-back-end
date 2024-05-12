import { Prisma } from "@prisma/client";
import { returnCategoryObject } from "src/category/return-category.object";


export const productReturnObject: Prisma.ProductSelect = {
    id: true,
    name: true,
    description: true,
    price: true,
    image: true,
    createdAt: true,
    slug: true,
}

export const productReturnObjectFullest: Prisma.ProductSelect = {
    ...productReturnObject,
    category: { select: returnCategoryObject }
}
