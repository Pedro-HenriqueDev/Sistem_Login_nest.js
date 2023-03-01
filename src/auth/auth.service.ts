import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcrypt"
import { User } from '@prisma/client';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService : UserService,
        private readonly jwtService : JwtService
    ) {}

    async login(user: User) {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            name: user.name
        };

        const jwtToken = this.jwtService.sign(payload)

        return {
            access_token: jwtToken
        }
    }
    
    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email)

        if(!user) {
            throw new Error("Email address or password provided is incorrect.")
        }
        const passwordStatus = await bcrypt.compare(password, user.password)

        if(!passwordStatus) {
            throw new Error("Email address or password provided is incorrect.")
        }

        return {
            ...user,
            password: undefined
        }
    }
}
