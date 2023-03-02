import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/jwt-refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() authLoginDto: LoginDto) {
    const { email, password } = authLoginDto;
    await this.authService.validateUser(email, password);
    return this.authService.login(authLoginDto);
  }

  @UseGuards(JwtAuthGuard)
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
