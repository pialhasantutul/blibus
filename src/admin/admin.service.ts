import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(name: string, email: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = this.adminRepository.create({ name, email, password: hashedPassword });
    return await this.adminRepository.save(admin);
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({ where: { email } });
  }

  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    const admin = await this.findByEmail(email);
    if (!admin) return null;
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return null;
    return admin;
  }
}