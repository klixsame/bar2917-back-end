import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StatiscticsService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getMain() {
        const ordersCount = await this.prisma.order.count()
        const feedbackCount = await this.prisma.feedback.count()
        const usersCount = await this.prisma.user.count()

        const totalAmount = await this.prisma.order.aggregate({
            _sum: {
                total: true
            }
        })

        // const user = await this.userService.byId(userId, {
        //     orders: {
        //         select: {
        //             items: true,
        //         }
        //     },
        //     feedbacks: true
        // });

    // Создаем массив объектов с информацией о заказах пользователя, обратной связи и общей сумме заказов
    const statistics = [
        {
            name: 'Заказы',
            value: ordersCount
        },
        {
            name: 'Обратная связь',
            value: feedbackCount
        },
        {
            name: 'Пользователи',
            value: usersCount
        },
        {
            name: 'Общая сумма заказов',
            value: `${totalAmount._sum.total} ₽`
        }
    ];

    return statistics;
}
}
