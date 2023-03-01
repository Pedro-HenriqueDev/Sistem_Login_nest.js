import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dtos';
import { User } from './entities/user.entity';
import * as bcrypt from "bcrypt"
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserDto): Promise<User> {
    
    if(await this.findByEmail(user.email)) {
      throw new BadRequestException()
    }
    
    const data: Prisma.UserCreateInput = {
        ...user,
        password: await bcrypt.hash(user.password, 10)
    }

    const userCreated = await this.prisma.user.create({data})
    return userCreated
  }

  async findByEmail(email: string) {
    const user: CreateUserDto = await this.prisma.user.findUnique({where: {email}})

    return user
  }
}