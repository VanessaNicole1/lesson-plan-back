import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../utils/decorators/get-user.decorator';
import { Role } from '../../utils/enums/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-account')
  getMyAccount(@GetUser() user) {
    return user;
  }

  @Post('assign-role')
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.usersService.assignRole(assignRoleDto);
  }

  @Get()
  findAll(@Query('type') type?: string) {
    const typeUser = type?.charAt(0).toUpperCase() + type?.slice(1);
    if (Object.keys(Role).some((v) => v === typeUser)) {
      return this.usersService.findAll(type);
    }
    return this.usersService.findAll();
  }

  @Get('managers')
  findAllWithManagerRole() {
    return this.usersService.findAllWithManagerRole();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
