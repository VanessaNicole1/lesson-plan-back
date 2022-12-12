import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { User } from 'src/modules/user/user-entity';
import { Role } from './enums/role.enum';

@Injectable()
export class ValidManager implements CanActivate {
  constructor(private reflector: Reflector, private config: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesKey = this.config.get('ROLES_KEY');
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(rolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    const manager = this.config.get('MANAGER_TYPE');
    const request = context.switchToHttp().getRequest();
    const currentUser: User = request.user;
    const roles = currentUser.roles;
    const rolesType = roles.map((role) => role.type);

    if (requiredRoles.includes(manager)) {
      if (rolesType.includes(requiredRoles[0])) {
        return true;
      }
    }
  }
}
