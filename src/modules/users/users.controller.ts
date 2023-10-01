import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../utils/decorators/get-user.decorator';
import { FilterUserDto } from './dto/filter-user.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthenticationGuard } from '../common/guards/authentication.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get('my-account')
  getMyAccount(@GetUser() user) {
    return user;
  }

  @Post('assign-role')
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.usersService.assignRole(assignRoleDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  findAll(@Query() filterUserDto?: FilterUserDto) {
    return this.usersService.findAll(filterUserDto);
  }

  @Get('managers')
  findAllWithManagerRole() {
    return this.usersService.findAllWithManagerRole();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('/registered/:registeredToken')
  findOneByRegisteredToken(
    @Param('registeredToken') registeredToken: string,
    @I18n() i18nContext: I18nContext
  ) {
    return this.usersService.findOneByRegisteredToken(registeredToken, i18nContext);
  }

  @Patch('reset-password/:id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @I18n() I18nContext: I18nContext
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto, I18nContext);
  }

  @Patch('reset-password-by-registered-token/:registeredToken')
  updatePasswordByRegisteredToken(
    @Param('registeredToken') registeredToken: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @I18n() I18nContext: I18nContext
  ) {
    return this.usersService.updatePasswordByRegisteredToken(registeredToken, updatePasswordDto, I18nContext);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
