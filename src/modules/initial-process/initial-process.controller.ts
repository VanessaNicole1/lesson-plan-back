import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { InitialProcessService } from './initial-process.service';
import { CreateInitialProcessDto } from './dto/create-initial-process.dto';
import { ValidManager } from '../../utils/guards/valid-manager.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { Role } from '../../utils/enums/roles.enum';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthenticationGuard } from '../common/guards/authentication.guard';

@Controller('initial-process')
export class InitialProcessController {
  constructor(private readonly initialProcessService: InitialProcessService) {}

  @Post()
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  create(
    @Body() createInitialProcessDto: CreateInitialProcessDto,
    @I18n() i18nContext: I18nContext
  ) {
    return this.initialProcessService.create(createInitialProcessDto, i18nContext);
  }
}
