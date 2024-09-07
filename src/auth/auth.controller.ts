import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor( private authService: AuthService) {
        
    }


    @Post('/register')
    register(@Body() registerDto: RegisterDto): Promise<User> {
        return this.authService.register(registerDto)
    }

    @Post('/login')
    login (@Body() loginDto: LoginDto): Promise<any> {
        return this.authService.login(loginDto)
    }



}
