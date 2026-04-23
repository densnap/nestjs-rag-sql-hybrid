import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ShopsService } from './shops.service';

@Controller('shops')
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @Get()
  getAllShops() {
    return this.shopsService.getAllShops();
  }

  @Put(':id')
  updateShop(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.shopsService.updateShop(Number(id), body);
  }
}