import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { EmailService } from "./email.service";
import { UpdateEmailConfigurationDto } from "./dto/update-email-configuration.dto";
import { CreateEmailConfigurationDto } from "./dto/create-email-configuration.dto";

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  find() {
    return this.emailService.find();
  }

  @Post()
  create(@Body() createEmailConfigurationDto: CreateEmailConfigurationDto) {
    return this.emailService.create(createEmailConfigurationDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailConfigurationDto: UpdateEmailConfigurationDto) {
    return this.emailService.update(id, updateEmailConfigurationDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.emailService.delete(id);

  }

}