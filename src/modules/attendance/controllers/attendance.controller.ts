import { Controller, Post, Get, Body, Request, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from '../services/attendance.service';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('check-in')
    checkIn(@Request() req: any) {
        const userId = req.user?.sub || 'bfed54ed-aefc-4bf6-b098-3a104a055ee7';
        return this.attendanceService.checkIn(userId);
    }

    @Post('check-out')
    checkOut(@Request() req: any) {
        const userId = req.user?.sub || 'bfed54ed-aefc-4bf6-b098-3a104a055ee7';
        return this.attendanceService.checkOut(userId);
    }

    @Get('summary')
    getSummary(@Request() req: any, @Query('from') from: string, @Query('to') to: string) {
        const userId = req.user?.sub || 'bfed54ed-aefc-4bf6-b098-3a104a055ee7';
        return this.attendanceService.getSummary(userId, from, to);
    }

    @Get('admin/monitor')
    getAllAdmin() {
        return this.attendanceService.getAllAdmin();
    }
}
