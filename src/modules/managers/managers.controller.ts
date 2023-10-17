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
import { ManagersService } from './managers.service';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { FilterManagerDto } from './dto/filter-manager.dto';
import { AuthenticationGuard } from '../common/guards/authentication.guard';
import { ValidManager } from '../../utils/guards/valid-manager.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { Role } from '../../utils/enums/roles.enum';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managersService.create(createManagerDto);
  }

  @Get()
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findAll(@Body() filterManagerDto: FilterManagerDto) {
    return this.managersService.findAll(filterManagerDto);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findOne(@Param('id') id: string) {
    return this.managersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managersService.update(+id, updateManagerDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  remove(@Param('id') id: string) {
    return this.managersService.remove(+id);
  }
}
