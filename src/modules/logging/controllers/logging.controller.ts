import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { LoggingService } from '../services/logging.service';

@Controller()
export class LoggingController {
    constructor(private readonly loggingService: LoggingService) { }

    @EventPattern('activity_log')
    async handleLogEvent(@Payload() data: any) {
        await this.loggingService.logActivity(data);
    }
}
