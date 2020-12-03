import { Controller, Get, Post, Req, Res, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthDTO } from './auth.dto';
import { CreateUserDto } from 'src/users/dto/create-users.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) { }

    @Post('email/username/validate')
    async emailUsernameValidate(@Body('email') email: string, @Body('username') username: string): Promise<any> {
        return await this.authService.emailUsernameValidate(email, username);
    }

    @Post('login')
    async login(@Body() user: AuthDTO): Promise<any> {
        return await this.authService.login(user);
    }

    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.authService.signup(createUserDto);
    }
}
