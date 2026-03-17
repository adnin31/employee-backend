import { Controller, Post, Get, Body, Request, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from '../services/attendance.service';

@Controller('api/v1/attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('check-in')
    checkIn(@Request() req: any) {
        const userId = req.user?.sub || 'mock-user-id';
        return this.attendanceService.checkIn(userId);
    }

    @Post('check-out')
    checkOut(@Request() req: any) {
        const userId = req.user?.sub || 'mock-user-id';
        return this.attendanceService.checkOut(userId);
    }

    @Get('summary')
    getSummary(@Request() req: any, @Query('from') from: string, @Query('to') to: string) {
        const userId = req.user?.sub || 'mock-user-id';
        return this.attendanceService.getSummary(userId, from, to);
    }

    @Get('admin/monitor')
    getAllAdmin() {
        return this.attendanceService.getAllAdmin();
    }
}
