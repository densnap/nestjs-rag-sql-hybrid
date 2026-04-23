import { Controller, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get(':shop_id')
  getOrders(@Param('shop_id') shop_id: string) {
    return this.ordersService.getOrdersByShop(Number(shop_id));
  }
}