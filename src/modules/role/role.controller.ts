import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { ValidManager } from '../auth/guards/valid-manager.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateRoleDto } from './dto/create-role-dto';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { Role as ROLE } from 'src/modules/auth/enums/role.enum';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  @UseGuards(JwtAuthGuard, ValidManager)
  @Roles(ROLE.Manager)
  getAllRoles() {
    return this.roleService.findAll();
  }

  @Get('/:id')
  getRoleById(@Param('id') id: string): Promise<Role> {
    return this.roleService.getRoleById(id);
  }

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get('/:type/type')
  getRoleByType(@Param('type') type: string): Promise<Role> {
    return this.roleService.getRoleByType(type);
  }
}
