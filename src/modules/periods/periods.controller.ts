import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { FilterPeriodDto } from './dto/filter-period.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthenticationGuard } from '../common/guards/authentication.guard';
import { ValidManager } from '../../utils/guards/valid-manager.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { Role } from '../../utils/enums/roles.enum';

@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  findAll(@Query() filterPeriodDto: FilterPeriodDto) {
    return this.periodsService.findAll(filterPeriodDto);
  }

  @Get('active')
  @UseGuards(AuthenticationGuard)
  findActivePeriods() {
    return this.periodsService.findActivePeriods();
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findOne(@Param('id') id: string, @I18n() i18nContext: I18nContext) {
    return this.periodsService.findOne(id, i18nContext);
  }

  @Get(':id/weeks')
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  getPeriodWeeks(@Param('id') id: string) {
    return this.periodsService.getPeriodWeeks(id);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  remove(@Param('id') id: string) {
    return this.periodsService.remove(id);
  }
}
