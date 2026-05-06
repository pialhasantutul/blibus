import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() body: Partial<Review>) {
    return this.reviewsService.create(body);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(Number(productId));
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reviewsService.delete(Number(id));
  }
}