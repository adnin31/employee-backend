import { Injectable } from '@nestjs/common';
import { ActivityLogRepository } from '../repositories/activity-log.repository';

@Injectable()
export class LoggingService {
    constructor(private readonly activityLogRepository: ActivityLogRepository) { }

    async logActivity(data: { user_id: string; action: string; description: string; payload?: any }) {
        console.log('Received log event:', data);
        return this.activityLogRepository.create(data);
    }
}
