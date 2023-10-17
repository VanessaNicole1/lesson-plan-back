import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { EmailService } from "./email.service";
import { UpdateEmailConfigurationDto } from "./dto/update-email-configuration.dto";
import { CreateEmailConfigurationDto } from "./dto/create-email-configuration.dto";
import { ValidManager } from "src/utils/guards/valid-manager.guard";
import { Roles } from "../../utils/decorators/roles.decorator";
import { Role } from "../../utils/enums/roles.enum";
import { AuthenticationGuard } from "../common/guards/authentication.guard";

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  find() {
    return this.emailService.find();
  }

  @Post()
  create(@Body() createEmailConfigurationDto: CreateEmailConfigurationDto) {
    return this.emailService.create(createEmailConfigurationDto);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  update(@Param('id') id: string, @Body() updateEmailConfigurationDto: UpdateEmailConfigurationDto) {
    return this.emailService.update(id, updateEmailConfigurationDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  delete(@Param('id') id: string) {
    return this.emailService.delete(id);

  }

}