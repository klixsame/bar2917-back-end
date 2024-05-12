import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Auth()
  getAll(@CurrentUser('id') userId: number) {
    return this.orderService.getAllOrders(userId)
  }
}
