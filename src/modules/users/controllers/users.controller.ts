import { Controller, Post, Get, Patch, Body, Request, Param, UseGuards } from '@nestjs/common';
import { AuthService, UsersService } from '../services/users.service';

// Mock guards for now
@Controller('api/v1/users')
export class UsersController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Post('login')
    async login(@Body() body: any) {
        return this.authService.login(body.email, body.password);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: any) {
        // In real app, req.user comes from Passport strategy
        const userId = req.user?.sub || 'mock-id';
        return this.usersService.getProfile(userId);
    }

    // @UseGuards(JwtAuthGuard)
    @Patch('profile')
    updateProfile(@Request() req: any, @Body() body: any) {
        const userId = req.user?.sub || 'mock-id';
        return this.usersService.updateProfile(userId, body);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('admin/manage')
    createEmployee(@Body() body: any) {
        return this.usersService.createEmployee(body);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('admin/manage/:id')
    updateEmployee(@Param('id') id: string, @Body() body: any, @Request() req: any) {
        const adminId = req.user?.sub || 'mock-admin-id';
        return this.usersService.updateEmployee(adminId, id, body);
    }
}
