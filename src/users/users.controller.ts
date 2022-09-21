import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('login')
  loginUser(@Body() userLoginDto: UserDto) {
    return this.usersService.login(userLoginDto);
  }
}
