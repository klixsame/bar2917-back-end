import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma.service';
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto';
import { ProductDto } from './dto/product.dto';
import { productReturnObject, productReturnObjectFullest } from './return-product.object';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  
  async getAll(dto: GetAllProductDto) {
    const {sort, searchTerm} = dto;

    const prismaSort:Prisma.ProductOrderByWithRelationInput[] = []

    if(sort === EnumProductSort.LOW_PRICE){
      prismaSort.push({price: 'asc'})
    }
    else if(sort === EnumProductSort.HIGH_PRICE){
      prismaSort.push({price: 'desc'})
    }
    else if(sort === EnumProductSort.NEWEST){
      prismaSort.push({createdAt: 'desc'})
    }
    else{
      prismaSort.push({createdAt: 'asc'})
    }

    const prismaSearchTermFilter:Prisma.ProductWhereInput = searchTerm ? {
      OR: [
        {name: {
          contains: searchTerm,
          mode: 'insensitive'
        }},
        {description: {
          contains: searchTerm,
          mode: 'insensitive'
        }}
      ]
    } : {}

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort, 
      select: productReturnObject
    })

    return {
      products,
      length: await this.prisma.product.count({
        where: prismaSearchTermFilter
      })
    }
  }

  async byId(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id
      },
      select: productReturnObjectFullest
    })

    if(!product){
        throw new NotFoundException('Product not found');
    }

    return product
  }

  async bySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug
      },
      select: productReturnObjectFullest
    })

    if(!product){
        throw new NotFoundException('Product not found by slug');
    }

    return product
  }

  async byCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug
        }
      },
      select: productReturnObjectFullest
    })

    if(!products){
      throw new NotFoundException('Products not found');
  }

  return products
  }

  async getSimilar(id: number) {
    const currentProduct = await this.byId(id)

    if(!currentProduct){
      throw new NotFoundException('Product not found');
    }

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name
        },
        NOT: {
          id: currentProduct.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: productReturnObject
    })

    return products
  }
  
  async create(categoryId: number) {

    // Проверяем существование категории
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId }
    });
    
    if (!category) {
      throw new NotFoundException('Не найдена категория при попытке создать продукт');
    }
    
    const product = await this.prisma.product.create({
      data: {
        name: '',
        slug: '',
        price: 0,
        description: '',
        image: '',
        weight: 0
      }
    })

    return product.id
  }

  async update(id: number, dto: ProductDto) {
  
    const { name, price, image, description, categoryId } = dto

    return this.prisma.product.update({
      where: { id },
      data: {
        description,
        image,
        price,
        name,
        slug: slugify(name).toLowerCase(),
        category: {
          connect: {
            id: categoryId
          }
        }
      }
    })
  }

  async delete(id: number) {
  
    return this.prisma.product.delete({
      where: { id }
    })
  }


}
