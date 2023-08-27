import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getVersion() {
    return {
      "Plan de Clases": "v0.0.1"
    }
  }
}
