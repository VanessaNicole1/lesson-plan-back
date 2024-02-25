import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateEmailConfigurationDto } from './dto/create-email-configuration.dto';
import { UpdateEmailConfigurationDto } from './dto/update-email-configuration.dto';
import { decryptPassword, encryptPassword } from '../../utils/password.utils';

@Injectable()
export class EmailRepository {
  constructor(private prisma: PrismaService) {}

  find() {
    return this.prisma.setting.findFirst();
  }

  async create(createEmailConfigurationDto: CreateEmailConfigurationDto) {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const { host, port, user, sender, password } = createEmailConfigurationDto;
    const encryptedPassword = await encryptPassword(password, encryptionKey);
    return this.prisma.setting.create({
      data: {
        host,
        port,
        user,
        sender,
        password: encryptedPassword,
      },
    });
  }

  async update(
    id: string,
    updateEmailConfigurationDto: UpdateEmailConfigurationDto,
  ) {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const { host, port, user, sender, password } = updateEmailConfigurationDto;
    const encryptedPassword = await encryptPassword(password, encryptionKey);

    return this.prisma.setting.update({
      where: {
        id,
      },
      data: {
        host,
        port,
        user,
        sender,
        password: encryptedPassword,
      },
    });
  }

  delete(id: string) {
    return this.prisma.setting.delete({
      where: {
        id,
      },
    });
  }
}
