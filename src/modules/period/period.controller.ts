import { PeriodsService } from './period.service';
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
import { Period } from './period.entity';
import { CreatePeriodDto } from './dto/create-period-dto';
import { UpdatePeriodDto } from './dto/update-period-dto';
import { AuthGuard } from '@nestjs/passport';
import { ValidManager } from 'src/modules/auth/valid-manager.guard';
import { Roles } from 'src/modules/auth/enums/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';

@Controller('periods')
export class PeriodsController {
  constructor(private periodsService: PeriodsService) {}

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getPeriodById(@Param('id') id: string): Promise<Period> {
    return this.periodsService.getPeriodById(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getAllPeriods() {
    return this.periodsService.getAllPeriod();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  createPeriod(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodsService.createPeriod(createPeriodDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  deletePeriod(@Param('id') id: string): Promise<void> {
    return this.periodsService.deletePeriod(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  updatePeriod(
    @Param('id') id: string,
    @Body() updatePeriodDto: UpdatePeriodDto,
  ) {
    return this.periodsService.updatePeriod(id, updatePeriodDto);
  }
}
