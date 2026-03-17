import { Controller, Post, Get, Patch, Delete, Body, Request, Param, Query, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService, UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    /** Decode the Bearer token and return the user's ID (sub claim). */
    private getUserIdFromRequest(req: any): string {
        const authHeader = req.headers?.authorization as string | undefined;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid token');
        }
        const token = authHeader.split(' ')[1];
        try {
            const payload = this.jwtService.verify(token);
            return payload.sub;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    @Post('login')
    async login(@Body() body: any) {
        return this.authService.login(body.email, body.password);
    }

    @Get('profile')
    getProfile(@Request() req: any) {
        const userId = this.getUserIdFromRequest(req);
        return this.usersService.getProfile(userId);
    }

    @Patch('profile')
    updateProfile(@Request() req: any, @Body() body: any) {
        const userId = this.getUserIdFromRequest(req);
        return this.usersService.updateProfile(userId, body);
    }

    // ----- HRD Admin endpoints -----

    @Get('admin/manage')
    listEmployees(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('search') search?: string,
    ) {
        return this.usersService.listEmployees({
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            search,
        });
    }

    @Post('admin/manage')
    createEmployee(@Body() body: any) {
        return this.usersService.createEmployee(body);
    }

    @Patch('admin/manage/:id')
    updateEmployee(@Param('id') id: string, @Body() body: any, @Request() req: any) {
        const adminId = this.getUserIdFromRequest(req);
        return this.usersService.updateEmployee(adminId, id, body);
    }

    @Delete('admin/manage/:id')
    deleteEmployee(@Param('id') id: string) {
        return this.usersService.deleteEmployee(id);
    }
}

