import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { UpdateRegisterConfigDto } from "./dto/update-register-config.dto";

@Injectable()
export class RegisterConfigRepository {
  constructor(private prisma: PrismaService) {}

  updateRegisterToken(registeredToken: string, updateRegisterConfigDto: UpdateRegisterConfigDto) {
    return this.prisma.registerConfig.update({
      where: {
        registerToken: registeredToken
      },
      data: {
        ...updateRegisterConfigDto
      }
    });
  }
}
