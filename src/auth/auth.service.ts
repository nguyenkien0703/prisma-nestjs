import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { hash , compare} from 'bcrypt';
import {JwtService} from '@nestjs/jwt'
@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService,
        private jwtService: JwtService

    ) {
        
    }
    register = async (userData: RegisterDto): Promise<User> => {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: userData.email
            }
        })
        if(user ) {
            throw new HttpException({message: "this email has been used"}, HttpStatus.BAD_REQUEST)
        }

        const hashPassword = await hash(userData.password, 10)
        const res = await this.prismaService.user.create({
            data: {
                ...userData, password: hashPassword
            }
        })
        return res
    }

    login = async (userData: LoginDto) => {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: userData.email
            }
        })
        if(!user) {
            throw new HttpException({message: "this email does not exist"}, HttpStatus.BAD_REQUEST)
        }
        const isPasswordMatch = await compare(userData.password, user.password)
        if(!isPasswordMatch) {
            throw new HttpException({message: "password is not correct"}, HttpStatus.BAD_REQUEST)
        }
        const payload = {email: user.email, id: user.id}
        const accessToken = await this.jwtService.sign(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: '1h'
        })
        const refreshToken = await this.jwtService.sign(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '7d'
        })

        return {user, accessToken, refreshToken}
    }

}
