import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { SellersService } from './sellers.service';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  create(
    @Body()
    body: {
      shopName: string;
      email: string;
      password: string;
      phone?: string;
      address?: string;
      shopDescription?: string;
    },
  ) {
    return this.sellersService.create(body);
  }

  @Get()
  findAll() {
    return this.sellersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(Number(id));
  }

  @Put(':id/approve')
  approve(@Param('id') id: string) {
    return this.sellersService.approve(Number(id));
  }

  @Put(':id/reject')
  reject(@Param('id') id: string) {
    return this.sellersService.reject(Number(id));
  }
}