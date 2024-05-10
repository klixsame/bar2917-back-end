import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { StatiscticsController } from './statisctics.controller';
import { StatiscticsService } from './statisctics.service';

@Module({
  controllers: [StatiscticsController],
  providers: [StatiscticsService, PrismaService, UserService]
})
export class StatiscticsModule {}
