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
import { InitialProcessService } from './initial-process.service';
import { CreateInitialProcessDto } from './dto/create-initial-process.dto';
import { UpdateInitialProcessDto } from './dto/update-initial-process.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ValidManager } from '../../utils/guards/valid-manager.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { Role } from '../../utils/enums/roles.enum';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('initial-process')
export class InitialProcessController {
  constructor(private readonly initialProcessService: InitialProcessService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ValidManager)
  @Roles(Role.Manager)
  create(
    @Body() createInitialProcessDto: CreateInitialProcessDto,
    @I18n() i18nContext: I18nContext
  ) {
    return this.initialProcessService.create(createInitialProcessDto, i18nContext);
  }

  @Get()
  findAll() {
    return this.initialProcessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.initialProcessService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInitialProcessDto: UpdateInitialProcessDto,
  ) {
    return this.initialProcessService.update(+id, updateInitialProcessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.initialProcessService.remove(+id);
  }
}
