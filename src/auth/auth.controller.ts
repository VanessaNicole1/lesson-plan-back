import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-dto';
import { RefreshTokenGuard } from './jwt-refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Body() authLoginDto: LoginDTO,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authLoginDto;
    const isUserValid = await this.authService.validateUser(email, password);
    if (!isUserValid) {
      throw new UnauthorizedException();
    }

    return await this.authService.login(authLoginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async logout(@Request() req: any) {
    return await this.authService.logout(req.user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Request() req: any) {
    const userId = req.user.id;
    const refreshToken = req.user.refreshToken;
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
