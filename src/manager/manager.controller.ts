import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Manager } from './manager.entity';
import { Body } from '@nestjs/common';
import { CreateorUpdateManagerDto } from './dto/create-update-manager.dto';

@Controller('manager')
export class ManagerController {
  constructor(private managerService: ManagerService) {}

  @Get('/:id')
  getManagerById(@Param('id') id: string): Promise<Manager> {
    return this.managerService.getManagerById(id);
  }

  @Post()
  createManager(@Body() createManagerDto: CreateorUpdateManagerDto) {
    return this.managerService.createManager(createManagerDto);
  }

  @Patch()
  updateManager(updateManagerDto: CreateorUpdateManagerDto) {
    return this.managerService.updateManager(updateManagerDto);
  }
}
