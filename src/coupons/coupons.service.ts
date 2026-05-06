import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>,
  ) {}

  async create(data: Partial<Coupon>): Promise<Coupon> {
    const coupon = this.couponsRepository.create(data);
    return await this.couponsRepository.save(coupon);
  }

  async findAll(): Promise<Coupon[]> {
    return await this.couponsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async validate(code: string): Promise<Coupon> {
    const coupon = await this.couponsRepository.findOne({ where: { code, isActive: true } });
    if (!coupon) throw new NotFoundException('Invalid or expired coupon');
    return coupon;
  }

  async use(code: string): Promise<void> {
    const coupon = await this.validate(code);
    await this.couponsRepository.update(coupon.id, { usedCount: coupon.usedCount + 1 });
  }

  async delete(id: number): Promise<void> {
    await this.couponsRepository.update(id, { isActive: false });
  }
}