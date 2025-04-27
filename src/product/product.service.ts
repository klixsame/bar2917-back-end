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
    const {sort, searchTerm, locationId} = dto;

    // Проверяем существование локации
    const location = await this.prisma.location.findUnique({
      where: { id: locationId }
    });

    if (!location) {
      throw new NotFoundException('Локация не найдена');
    }

    // Формируем условия фильтрации
    const where: Prisma.ProductWhereInput = {
      locations: {
        some: {
          locationId: locationId // Только товары, доступные в этой локации
        }
      }
    };

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
      where: {
        ...where,
        ...prismaSearchTermFilter
      },
      include: {
        locations: {
          where: {
            locationId: locationId
          },
          select: {
            price: true
          }
        }
      }
    });

    // Сортируем продукты по цене в памяти
    if (sort === EnumProductSort.LOW_PRICE) {
      products.sort((a, b) => {
        const priceA = a.locations[0]?.price || 0;
        const priceB = b.locations[0]?.price || 0;
        return priceA - priceB;
      });
    } else if (sort === EnumProductSort.HIGH_PRICE) {
      products.sort((a, b) => {
        const priceA = a.locations[0]?.price || 0;
        const priceB = b.locations[0]?.price || 0;
        return priceB - priceA;
      });
    } else if (sort === EnumProductSort.NEWEST) {
      products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      products.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

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
        description: '',
        image: '',
        weight: 0
      }
    });

    return product.id;
  }

  async update(id: number, dto: ProductDto) {
    const { name, image, description, categoryId, items } = dto;

    return this.prisma.product.update({
      where: { id },
      data: {
        description,
        image,
        name,
        slug: slugify(name).toLowerCase(),
        category: {
          connect: {
            id: categoryId
          }
        },
        locations: {
          create: items.map(item => ({
            price: item.price,
            locationId: item.locationId
          }))
        }
      }
    });
  }

  async delete(id: number) {
  
    return this.prisma.product.delete({
      where: { id }
    })
  }

  async getProductPrice(productId: number, locationId: number) {
    const productLocation = await this.prisma.productLocation.findUnique({
      where: {
        productId_locationId: {
          productId,
          locationId
        }
      },
      select: {
        price: true,
        isAvailable: true
      }
    });

    if (!productLocation) {
      throw new NotFoundException('Цена для данного продукта в указанной локации не найдена');
    }

    if (!productLocation.isAvailable) {
      throw new NotFoundException('Продукт недоступен в данной локации');
    }

    return productLocation.price;
  }

}
