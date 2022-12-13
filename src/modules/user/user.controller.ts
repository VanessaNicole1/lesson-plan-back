import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { ValidManager } from 'src/modules/auth/valid-manager.guard';
import { ValidUser } from 'src/modules/auth/valid-user.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './user-entity';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-account')
  getMyAccount(@GetUser() user) {
    return user;
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), ValidUser)
  @Roles(Role.Manager, Role.Student, Role.Teacher)
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

  @Post('assign-role/:id/:role')
  assignRole(@Param('id') id: string, @Param('role') role: string) {
    return this.userService.assignRole(id, role);
  }

  @Post('update-password')
  @UseGuards(JwtAuthGuard)
  updatePassword(
    @GetUser() user,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(user, updatePasswordDto);
  }
}