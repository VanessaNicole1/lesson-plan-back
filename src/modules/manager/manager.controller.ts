import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Manager } from './manager.entity';
import { Body } from '@nestjs/common';
import { CreateorUpdateManagerDto } from './dto/create-update-manager.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/modules/auth/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';
import { ValidManager } from '../auth/guards/valid-manager.guard';

@Controller('manager')
export class ManagerController {
  constructor(private managerService: ManagerService) {}

  @Post()
  createManager(@Body() createManagerDto: CreateorUpdateManagerDto) {
    return this.managerService.createManager(createManagerDto);
  }

  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @Get('/:id')
  getManagerById(@Param('id') id: string): Promise<Manager> {
    return this.managerService.getManagerById(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getAllManager() {
    return this.managerService.getManagers();
  }

  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @Delete('/:id')
  deleteManager(@Param('id') id: string) {
    return this.managerService.deleteManager(id);
  }

  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @Put('/:id')
  updateManager(
    @Param('id') id: string,
    @Body() updateManagerDto: CreateorUpdateManagerDto,
  ) {
    return this.managerService.updateManager(id, updateManagerDto);
  }
}
