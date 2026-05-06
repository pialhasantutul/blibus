import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    return this.adminService.create(body.name, body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const admin = await this.adminService.validateAdmin(body.email, body.password);
    if (!admin) return { message: 'Invalid credentials' };
    const token = this.jwtService.sign({ sub: admin.id, email: admin.email, role: admin.role });
    return {
      access_token: token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    };
  }
}