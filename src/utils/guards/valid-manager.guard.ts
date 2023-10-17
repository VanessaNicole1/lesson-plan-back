import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { roles } from './../variables.utils';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../enums/roles.enum';

@Injectable()
export class ValidManager implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const currentUser: User = request.user;

    const userRoles = currentUser.roles;
    const rolesType = userRoles.map((role) => role.name);

    if (requiredRoles.includes(Role.Manager)) {
      if (rolesType.includes(requiredRoles[0])) {
        return true;
      }
    }
  }
}
