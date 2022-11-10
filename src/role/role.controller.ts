import { Controller, Get, Param, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role-dto';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

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
