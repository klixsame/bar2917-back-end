import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { FeedbackModule } from './feedback/feedback.module';
import { OrderModule } from './order/order.module';
import { PrismaService } from './prisma.service';
import { ProductModule } from './product/product.module';
import { StatiscticsModule } from './statisctics/statisctics.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'), // Правильно используйте join для построения пути
      serveRoot: '/assets', // Укажите URL-префикс для доступа к статическим файлам
    }),
    AuthModule,
    UserModule,
    ProductModule,
    FeedbackModule,
    CategoryModule,
    OrderModule,
    StatiscticsModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

