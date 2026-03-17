import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from '../../../entities/attendance.entity';

@Injectable()
export class AttendanceRepository {
    constructor(
        @InjectRepository(Attendance)
        private readonly ormRepository: Repository<Attendance>,
    ) { }

    async create(attendance: Partial<Attendance>): Promise<Attendance> {
        const newRecord = this.ormRepository.create(attendance);
        return this.ormRepository.save(newRecord);
    }

    async findActiveCheckIn(userId: string): Promise<Attendance | null> {
        return this.ormRepository.findOne({
            where: { user_id: userId, check_out: null },
            order: { created_at: 'DESC' },
        });
    }

    async update(id: string, updateData: Partial<Attendance>): Promise<void> {
        await this.ormRepository.update(id, updateData);
    }

    async getSummary(userId: string, from: Date, to: Date): Promise<Attendance[]> {
        return this.ormRepository
            .createQueryBuilder('attendance')
            .where('attendance.user_id = :userId', { userId })
            .andWhere('attendance.created_at >= :from', { from })
            .andWhere('attendance.created_at <= :to', { to })
            .getMany();
    }

    async getAll(): Promise<Attendance[]> {
        return this.ormRepository.find({ relations: ['user'], order: { created_at: 'DESC' } });
    }
}
