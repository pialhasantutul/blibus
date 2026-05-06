import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async create(data: Partial<Review>): Promise<Review> {
    const review = this.reviewsRepository.create(data);
    return await this.reviewsRepository.save(review);
  }

  async findByProduct(productId: number): Promise<Review[]> {
    return await this.reviewsRepository.find({ where: { productId, isActive: true }, order: { createdAt: 'DESC' } });
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async delete(id: number): Promise<void> {
    await this.reviewsRepository.update(id, { isActive: false });
  }
}