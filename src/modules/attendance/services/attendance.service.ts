import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { AttendanceStatus } from '../../../entities/attendance.entity';

@Injectable()
export class AttendanceService {
    constructor(
        private readonly attendanceRepository: AttendanceRepository,
        @Inject('LOGGING_SERVICE') private readonly loggingClient: ClientProxy,
    ) { }

    async checkIn(userId: string) {
        const active = await this.attendanceRepository.findActiveCheckIn(userId);
        if (active) throw new BadRequestException('Already checked in');

        const record = await this.attendanceRepository.create({
            user_id: userId,
            check_in: new Date(),
            status: AttendanceStatus.PRESENT,
        });

        this.loggingClient.emit('activity_log', {
            user_id: userId,
            action: 'CHECK_IN',
            description: 'User checked in via Attendance Service',
            payload: record,
        });

        return record;
    }

    async checkOut(userId: string) {
        const active = await this.attendanceRepository.findActiveCheckIn(userId);
        if (!active) throw new BadRequestException('No active check-in found');

        const updateData = { check_out: new Date() };
        await this.attendanceRepository.update(active.id, updateData);

        this.loggingClient.emit('activity_log', {
            user_id: userId,
            action: 'CHECK_OUT',
            description: 'User checked out via Attendance Service',
            payload: { attendanceId: active.id, check_out: updateData.check_out },
        });

        return { ...active, ...updateData };
    }

    async getSummary(userId: string, from: string, to: string) {
        return this.attendanceRepository.getSummary(userId, new Date(from), new Date(to));
    }

    async getAllAdmin() {
        return this.attendanceRepository.getAll();
    }
}
