import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(data);
    return await this.productsRepository.save(product);
  }

  async findAll(search?: string, category?: string): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true });
    if (search) {
      query.andWhere('(product.name LIKE :search OR product.description LIKE :search)', { search: `%${search}%` });
    }
    if (category) {
      query.andWhere('product.category = :category', { category });
    }
    return await query.orderBy('product.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    await this.productsRepository.update(id, data);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.productsRepository.update(id, { isActive: false });
  }

  async getFeatured(): Promise<Product[]> {
    return await this.productsRepository.find({ where: { isFeatured: true, isActive: true } });
  }

  async getTotalCount(): Promise<number> {
    return await this.productsRepository.count();
  }
}