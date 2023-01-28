import { Body, Controller, Post } from '@nestjs/common';
import { CreateInitialProcessDto } from './dto/create-initial-process.dto';
import { InitialProcessService } from './initial-process.service';

@Controller('initial-process')
export class InitialProcessController {
  constructor(private initialProcessService: InitialProcessService) {}

  @Post()
  async createInitialProcess(
    @Body() createInitialProcessDto: CreateInitialProcessDto,
  ) {
    return this.initialProcessService.createInitialProcess(
      createInitialProcessDto,
    );
  }
}
