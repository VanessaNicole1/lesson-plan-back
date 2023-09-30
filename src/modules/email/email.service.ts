import { Injectable } from "@nestjs/common";
import { CreateEmailConfigurationDto } from "./dto/create-email-configuration.dto";
import { UpdateEmailConfigurationDto } from "./dto/update-email-configuration.dto";
import { EmailRepository } from "./email.repository";

@Injectable()
export class EmailService {
  constructor(private emailRepository: EmailRepository) {}

  find() {
    return this.emailRepository.find();
  }

  create(createEmailConfigurationDto: CreateEmailConfigurationDto) {
    return this.emailRepository.create(createEmailConfigurationDto);
  }

  update(id: string, updateEmailConfigurationDto: UpdateEmailConfigurationDto) {
    return this.emailRepository.update(id, updateEmailConfigurationDto);
  }
}