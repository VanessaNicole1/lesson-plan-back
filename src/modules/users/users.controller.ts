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
import { GetUser } from '../../utils/decorators/get-user.decorator';
import { FilterUserDto } from './dto/filter-user.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthenticationGuard } from '../common/guards/authentication.guard';
import { ValidManager } from '../../utils/guards/valid-manager.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { Role } from '../../utils/enums/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get('my-account')
  getMyAccount(@GetUser() user) {
    return user;
  }

  @Post('assign-role')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.usersService.assignRole(assignRoleDto);
  }

  @Get()
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  findAll(@Query() filterUserDto?: FilterUserDto) {
    return this.usersService.findAll(filterUserDto);
  }

  @Get('managers')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findAllWithManagerRole() {
    return this.usersService.findAllWithManagerRole();
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('/registered/:registeredToken')
  findOneByRegisteredToken(
    @Param('registeredToken') registeredToken: string,
    @I18n() i18nContext: I18nContext,
  ) {
    return this.usersService.findOneByRegisteredToken(
      registeredToken,
      i18nContext,
    );
  }

  @Patch('reset-password/:id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @I18n() I18nContext: I18nContext,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto, I18nContext);
  }

  @Patch('reset-password-by-registered-token/:registeredToken')
  updatePasswordByRegisteredToken(
    @Param('registeredToken') registeredToken: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @I18n() I18nContext: I18nContext,
  ) {
    return this.usersService.updatePasswordByRegisteredToken(
      registeredToken,
      updatePasswordDto,
      I18nContext,
    );
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
