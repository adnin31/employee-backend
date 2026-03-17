import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../../../entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async login(email: string, pass: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) { }

    async getProfile(userId: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateProfile(userId: string, updateData: any) {
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        await this.userRepository.update(userId, updateData);
        return this.getProfile(userId);
    }

    async listEmployees(params: { page: number; limit: number; search?: string }) {
        const { page, limit, search } = params;
        const skip = (page - 1) * limit;
        const [data, total] = await this.userRepository.findAll({ skip, take: limit, search });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async createEmployee(employeeData: any) {
        const existingUser = await this.userRepository.findByEmail(employeeData.email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        employeeData.password = await bcrypt.hash(employeeData.password, 10);
        return this.userRepository.save(employeeData);
    }

    async updateEmployee(adminId: string, employeeId: string, updateData: any) {
        const employee = await this.userRepository.findById(employeeId);
        if (!employee) throw new NotFoundException('Employee not found');
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        await this.userRepository.update(employeeId, updateData);
        return this.getProfile(employeeId);
    }

    async deleteEmployee(employeeId: string) {
        const employee = await this.userRepository.findById(employeeId);
        if (!employee) throw new NotFoundException('Employee not found');
        await this.userRepository.delete(employeeId);
        return { message: 'Employee deleted successfully' };
    }
}

