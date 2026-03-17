import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AttendanceController } from './controllers/attendance.controller';
import { AttendanceService } from './services/attendance.service';
import { AttendanceRepository } from './repositories/attendance.repository';
import { Attendance } from '../../entities/attendance.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Attendance]),
        ClientsModule.register([
            {
                name: 'LOGGING_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'logs_queue',
                    queueOptions: { durable: false },
                },
            },
        ]),
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService, AttendanceRepository],
})
export class AttendanceModule { }
