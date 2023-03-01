import { Controller, Get, Request } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import {CurrentUser} from "src/auth/decorators/current-user.decorator"
@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return "Hello Word";
  }

  @Get("me")
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
