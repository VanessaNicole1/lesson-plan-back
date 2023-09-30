import { PrismaService } from "../common/services/prisma.service";
import { CreateEmailConfigurationDto } from "./dto/create-email-configuration.dto";
import { UpdateEmailConfigurationDto } from "./dto/update-email-configuration.dto";

export class EmailRepository {
  constructor(private prisma: PrismaService) {}

  find() {
    return this.prisma.setting.findFirst();
  }

  create(createEmailConfigurationDto: CreateEmailConfigurationDto) {
    const { host, port, user, sender, password } = createEmailConfigurationDto;
    return this.prisma.setting.create({
      data: {
        host,
        port,
        user,
        sender,
        password,
      }
    });
  }

  update(id: string, updateEmailConfigurationDto: UpdateEmailConfigurationDto) {
    const { host, port, user, sender, password } = updateEmailConfigurationDto;

    return this.prisma.setting.update({
      where: {
        id
      },
      data: {
        host,
        port,
        user,
        sender,
        password
      }
    });
  }
}