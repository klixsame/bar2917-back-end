import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatiscticsService {
    constructor(
        private prisma: PrismaService,
        private userService: UserService
    ) {}

    async totalUsers() {
        return this.prisma.user.count();
    }

    async getMain(userId: number) {
        const user = await this.userService.byId(userId, {
            orders: {
                select: {
                    items: true,
                }
            },
            feedbacks: true
        });

    //     const totalAmount = await this.prisma.$queryRaw`
    //     SELECT SUM(amount * 1) as total_amount
    //     FROM Order
    //     WHERE userId = ${userId}
    // `;

    // Создаем массив объектов с информацией о заказах пользователя, обратной связи и общей сумме заказов
    const statistics = [
        {
            name: 'Orders',
            value: user.orders.length
        },
        {
            name: 'Feedbacks',
            value: user.feedbacks.length
        },
        {
            name: 'Total amount',
            value: 1000
        }
    ];

    return statistics;
}
}
