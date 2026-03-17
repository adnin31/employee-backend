import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from '../../../entities/activity-log.entity';

@Injectable()
export class ActivityLogRepository {
    constructor(
        @InjectRepository(ActivityLog)
        private readonly ormRepository: Repository<ActivityLog>,
    ) { }

    async create(logData: Partial<ActivityLog>): Promise<ActivityLog> {
        const newLog = this.ormRepository.create(logData);
        return this.ormRepository.save(newLog);
    }
}
