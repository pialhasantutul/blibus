import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(data: Partial<Order>): Promise<Order> {
    const orderNumber = 'BLB' + Date.now();
    const order = this.ordersRepository.create({ ...data, orderNumber });
    return await this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.ordersRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findByUser(userId: number): Promise<Order[]> {
    return await this.ordersRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    await this.ordersRepository.update(id, { status });
    return await this.findOne(id);
  }

  async getTotalCount(): Promise<number> {
    return await this.ordersRepository.count();
  }

  async getTotalRevenue(): Promise<number> {
    const result = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.paymentStatus = :status', { status: 'paid' })
      .getRawOne();
    return result?.total || 0;
  }
}