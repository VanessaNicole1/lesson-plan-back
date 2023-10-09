import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '../../users/users.service';
import { CreateManagerUserDto } from 'src/modules/users/dto/create-manager-user.dto';

export class AuthenticationError extends Error {}

@Injectable()
export class AuthenticationService {
  private readonly baseURL: string;
  private readonly tenant: string;

  constructor(
    private readonly httpService: HttpService,
    private usersService: UsersService,
  ) {
    this.baseURL = process.env.AUTH_SERVICE_URL;
    this.tenant = process.env.AUTH_SERVICE_TENANT;
  }

  async authenticate(accessToken: string) {
    const url = `${this.baseURL}/realms/${this.tenant}/protocol/openid-connect/userinfo`;

    try {
      const headers = {
        authorization: `Bearer ${accessToken}`,
      };
      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );

      if (response.status !== 200) {
        throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
      }

      const { data } = response;
      const userRoles = data.resource_access.lessonPlan.roles;

      if (userRoles.includes('manager')) {
        const currentUser = this.usersService.findByUsername(data.email);
        if (!currentUser) {
          const createManagerDto: CreateManagerUserDto = {
            name: data.given_name,
            lastName: data.family_name,
            email: data.email,
          };
          await this.usersService.createManager(createManagerDto);
        }
      }

      const { email } = response.data;
      const userInformation = await this.usersService.findByUsername(email);
      return userInformation;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
