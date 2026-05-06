import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { SellersModule } from './sellers/sellers.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CouponsModule } from './coupons/coupons.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AiModule } from './ai/ai.module';

// Entities
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Order } from './orders/order.entity';
import { Admin } from './admin/admin.entity';
import { Seller } from './sellers/seller.entity';
import { Category } from './categories/category.entity';
import { Review } from './reviews/review.entity';
import { Coupon } from './coupons/coupon.entity';
import { Notification } from './notifications/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'blibus_db',
      entities: [
        User,
        Product,
        Order,
        Admin,
        Seller,
        Category,
        Review,
        Coupon,
        Notification,
      ],
      synchronize: true,
      dropSchema: false,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    AdminModule,
    SellersModule,
    CategoriesModule,
    ReviewsModule,
    CouponsModule,
    NotificationsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}