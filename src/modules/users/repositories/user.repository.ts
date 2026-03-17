import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    async save(user: Partial<User>): Promise<User> {
        const newUser = this.ormRepository.create(user);
        return this.ormRepository.save(newUser);
    }

    async update(id: string, updateData: Partial<User>): Promise<void> {
        await this.ormRepository.update(id, updateData);
    }
}
