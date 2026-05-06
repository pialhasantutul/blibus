import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Coupon } from './coupon.entity';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  create(@Body() body: Partial<Coupon>) {
    return this.couponsService.create(body);
  }

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Post('validate')
  validate(@Body() body: { code: string }) {
    return this.couponsService.validate(body.code);
  }

  @Post('use')
  use(@Body() body: { code: string }) {
    return this.couponsService.use(body.code);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.couponsService.delete(Number(id));
  }
}