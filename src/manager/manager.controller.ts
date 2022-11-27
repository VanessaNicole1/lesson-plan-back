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
import { ValidManager } from 'src/auth/valid-manager.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('manager')
export class ManagerController {
  constructor(private managerService: ManagerService) {}

  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @Get('/:id')
  getManagerById(@Param('id') id: string): Promise<Manager> {
    return this.managerService.getManagerById(id);
  }

  @Post()
  createManager(@Body() createManagerDto: CreateorUpdateManagerDto) {
    return this.managerService.createManager(createManagerDto);
  }

  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @Delete('/:id')
  deleteManager(@Param('id') id: string): Promise<void> {
    return this.managerService.deleteManager(id);
  }

  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @Put(':id')
  updateManager(
    @Param('id') id: string,
    @Body() updateManagerDto: CreateorUpdateManagerDto,
  ) {
    return this.managerService.updateManager(id, updateManagerDto);
  }
}
