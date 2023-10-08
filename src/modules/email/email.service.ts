import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmailConfigurationDto } from './dto/create-email-configuration.dto';
import { UpdateEmailConfigurationDto } from './dto/update-email-configuration.dto';
import { EmailRepository } from './email.repository';
import { decryptPassword } from '../../utils/password.utils';

@Injectable()
export class EmailService {
  constructor(private emailRepository: EmailRepository) {}

  find() {
    return this.emailRepository.find();
  }

  create(createEmailConfigurationDto: CreateEmailConfigurationDto) {
    return this.emailRepository.create(createEmailConfigurationDto);
  }

  async update(
    id: string,
    updateEmailConfigurationDto: UpdateEmailConfigurationDto,
  ) {
    const { password } = updateEmailConfigurationDto;
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const emailSettings = await this.find();
    const decryptedPassword = decryptPassword(
      emailSettings.password,
      encryptionKey,
    );

    if (password === decryptedPassword) {
      return this.emailRepository.update(id, updateEmailConfigurationDto);
    } else {
      throw new BadRequestException('Credenciales inválidas');
    }
  }

  delete(id: string) {
    return this.emailRepository.delete(id);
  }
}
