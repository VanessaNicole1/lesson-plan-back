import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Body() authLoginDto: LoginDTO,
  ): Promise<{ access_token: string }> {
    const { email, password } = authLoginDto;
    const isUserValid = await this.authService.validateUser(email, password);
    if (!isUserValid) {
      throw new UnauthorizedException();
    }

    return await this.authService.login(authLoginDto);
  }
}
