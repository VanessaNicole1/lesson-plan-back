import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { ValidManager } from 'src/auth/valid-manager.guard';
import { ValidUser } from 'src/auth/valid-user.guard';
import { User } from './user-entity';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), ValidUser)
  @Roles(Role.Manager, Role.Student, Role.Student)
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<string> {
    return this.userService.deleteUser(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
