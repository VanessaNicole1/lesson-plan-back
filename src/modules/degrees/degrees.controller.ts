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
import { DegreesService } from './degrees.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { FilterDegreeDto } from './dto/filter-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { AuthenticationGuard } from '../common/guards/authentication.guard';
import { ValidManager } from '../../utils/guards/valid-manager.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { Role } from '../../utils/enums/roles.enum';

@Controller('degrees')
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  @Post()
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  create(@Body() createDegreeDto: CreateDegreeDto) {
    return this.degreesService.create(createDegreeDto);
  }

  @Get()
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findAll(@Body() filterDegreeDto: FilterDegreeDto) {
    return this.degreesService.findAll(filterDegreeDto);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findOne(@Param('id') id: string) {
    return this.degreesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  update(@Param('id') id: string, @Body() updateDegreeDto: UpdateDegreeDto) {
    return this.degreesService.update(+id, updateDegreeDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  remove(@Param('id') id: string) {
    return this.degreesService.remove(+id);
  }
}
