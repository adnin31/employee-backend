import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingController } from './controllers/logging.controller';
import { LoggingService } from './services/logging.service';
import { ActivityLogRepository } from './repositories/activity-log.repository';
import { ActivityLog } from '../../entities/activity-log.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityLog])],
    controllers: [LoggingController],
    providers: [LoggingService, ActivityLogRepository],
})
export class LoggingModule { }
