import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { CreateManagerDto } from './dto/create-manager.dto';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managersService.create(createManagerDto);
  }

  @Get('')
  findAll(@Query('period') periodId?: string) {
    return this.managersService.findAll(periodId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managersService.update(+id, updateManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managersService.remove(+id);
  }
}
