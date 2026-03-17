import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../../../entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly ormRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.ormRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.ormRepository.findOne({ where: { id } });
    }

    async findAll(params: { skip: number; take: number; search?: string }): Promise<[User[], number]> {
        const { skip, take, search } = params;
        const where: any[] = search
            ? [
                { name: Like(`%${search}%`) },
                { email: Like(`%${search}%`) },
                { position: Like(`%${search}%`) },
            ]
            : [{}];
        return this.ormRepository.findAndCount({ where, skip, take, order: { created_at: 'DESC' }, select: ['id', 'name', 'email', 'position', 'phone_number', 'role', 'photo_url', 'created_at'] });
    }

    async save(user: Partial<User>): Promise<User> {
        const newUser = this.ormRepository.create(user);
        return this.ormRepository.save(newUser);
    }

    async update(id: string, updateData: Partial<User>): Promise<void> {
        await this.ormRepository.update(id, updateData);
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }
}
