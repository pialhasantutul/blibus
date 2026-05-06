import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(data: Partial<Category>): Promise<Category> {
    const category = this.categoriesRepository.create(data);
    return await this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category | null> {
    return await this.categoriesRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Category>): Promise<Category | null> {
    await this.categoriesRepository.update(id, data);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.categoriesRepository.update(id, { isActive: false });
  }
}