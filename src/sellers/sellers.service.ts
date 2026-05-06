import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './seller.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private sellersRepository: Repository<Seller>,
  ) {}

  async create(data: {
    shopName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    shopDescription?: string;
  }): Promise<Seller> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const seller = this.sellersRepository.create({
      ...data,
      password: hashedPassword,
    });
    return await this.sellersRepository.save(seller);
  }

  async findAll(): Promise<Seller[]> {
    return await this.sellersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Seller | null> {
    return await this.sellersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Seller | null> {
    return await this.sellersRepository.findOne({ where: { email } });
  }

  async update(id: number, data: Partial<Seller>): Promise<Seller | null> {
    await this.sellersRepository.update(id, data);
    return await this.findOne(id);
  }

  async approve(id: number): Promise<Seller | null> {
    await this.sellersRepository.update(id, {
      status: 'approved',
      isVerified: true,
    });
    return await this.findOne(id);
  }

  async reject(id: number): Promise<Seller | null> {
    await this.sellersRepository.update(id, { status: 'rejected' });
    return await this.findOne(id);
  }

  async getTotalCount(): Promise<number> {
    return await this.sellersRepository.count();
  }
}