import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthenticationGuard } from '../common/guards/authentication.guard';
import { ValidManager } from '../../utils/guards/valid-manager.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { Role } from '../../utils/enums/roles.enum';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  // @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
