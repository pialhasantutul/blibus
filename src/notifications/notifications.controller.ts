import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() body: Partial<Notification>) {
    return this.notificationsService.create(body);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(Number(userId));
  }

  @Get('unread/:userId')
  getUnreadCount(@Param('userId') userId: string) {
    return this.notificationsService.getUnreadCount(Number(userId));
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(Number(id));
  }

  @Put('user/:userId/read-all')
  markAllAsRead(@Param('userId') userId: string) {
    return this.notificationsService.markAllAsRead(Number(userId));
  }
}