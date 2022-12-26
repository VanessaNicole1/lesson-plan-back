import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DegreeService } from './degree.service';
import { Degree } from './degree.entity';
import { CreateDegreeDto } from './dto/create-degree-dto';
import { UpdateDegreeDto } from './dto/update-degree-dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/modules/auth/enums/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';
import { ValidManager } from '../auth/guards/valid-manager.guard';

@Controller('degree')
export class DegreesController {
  constructor(private degreesService: DegreeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  createDegree(@Body() createDegreeDto: CreateDegreeDto) {
    return this.degreesService.createDegree(createDegreeDto);
  }

  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @Get('/:id')
  getDegreeById(@Param('id') id: string): Promise<Degree> {
    return this.degreesService.getDegreeById(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getDegrees() {
    return this.degreesService.getDegrees();
  }

  @Get('/:id/grades')
  getGradesByDegree(@Param('id') id: string) {
    return this.degreesService.getGradesByDegree(id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  deleteDegree(@Param('id') id: string) {
    return this.degreesService.deleteDegree(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  updateDegree(
    @Param('id') id: string,
    @Body() updateDegreeDto: UpdateDegreeDto,
  ) {
    return this.degreesService.updateDegree(id, updateDegreeDto);
  }
}
