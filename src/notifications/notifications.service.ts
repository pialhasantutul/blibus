import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationsRepository.create(data);
    return await this.notificationsRepository.save(notification);
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return await this.notificationsRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async markAsRead(id: number): Promise<void> {
    await this.notificationsRepository.update(id, { isRead: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationsRepository.update({ userId }, { isRead: true });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await this.notificationsRepository.count({ where: { userId, isRead: false } });
  }
}