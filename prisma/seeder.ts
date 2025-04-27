import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Очистка ProductLocation перед вставкой
  await prisma.productLocation.deleteMany();

  // Массив цен для продуктов
  const prices = [
    500,350,350,520,480,520,500,450,520,500,520,520,500,450,330,450,450,480,460,480,470,380,420,500,400,480,420,550,550,520,520,500,520,550,550,550,650,1200,900,900,1600,1000,1650,900,1600,1500,1300,1300,1850,2400,1300,2500,1600,1100,1300,200,300,220,250,300,400,220,200,250,300,220,270,270,300,270,370,370,250,250,150,350,400,100,150,150,220,220,250,250,250,120,120,120,150,250,280,280,280,280,350,400,120,140,140,140,140,90,150,400,700,180,290,450,30,0,30,50,50,30
  ];

  // Получаем все продукты из базы (id гарантированно совпадает с индексом в массиве - 1)
  const allProducts = await prisma.product.findMany();

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];
    const price = prices[i] || 0;
    // Всегда создаём для locationId 1
    await prisma.productLocation.create({
      data: {
        productId: product.id,
        locationId: 1,
        price,
        isAvailable: true,
      },
    });
    // Для всех, кроме id 28-37 (пиццы), создаём для locationId 2
    if (product.id < 28 || product.id > 37) {
      await prisma.productLocation.create({
        data: {
          productId: product.id,
          locationId: 2,
          price,
          isAvailable: true,
        },
      });
    }
  }

  console.log('Все продукты и ProductLocation успешно добавлены в базу данных.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



