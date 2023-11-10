import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JWTPayload } from './jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email } = loginDto;
    const user = await this.usersService.findByUsername(email);
    const payload: JWTPayload = { username: user!.email, sub: user!.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    delete user.password;
    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
      refreshToken: refreshToken,
    };
  }

  async logout(userId: string) {
    return this.usersService.updateRefreshToken(userId, null);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.SECRET_KEY_JWT,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async hashData(data: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(data, salt);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await bcrypt.compareSync(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
