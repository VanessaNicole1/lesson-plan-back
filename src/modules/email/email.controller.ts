import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { EmailService } from "./email.service";
import { UpdateEmailConfigurationDto } from "./dto/update-email-configuration.dto";
import { CreateEmailConfigurationDto } from "./dto/create-email-configuration.dto";

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  create(@Body() createEmailConfigurationDto: CreateEmailConfigurationDto) {
    return this.emailService.create(createEmailConfigurationDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailConfigurationDto: UpdateEmailConfigurationDto) {
    return this.emailService.update(id, updateEmailConfigurationDto);
  }

}