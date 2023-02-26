import { User } from '../../modules/users/entities/user.entity';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';

@Injectable()
export class ValidManager implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesKey = 'roles';
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(rolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('REQ requiredRoles', requiredRoles);

    for (let i = 0; i < requiredRoles.length; i++) {
      console.log('requiredRoles', requiredRoles[i]);
    }

    const request = context.switchToHttp().getRequest();
    const currentUser: User = request.user;
    const roles = currentUser.roles;
    const rolesType = roles.map((role) => role.name);

    if (requiredRoles.includes(Role.Manager)) {
      if (rolesType.includes(requiredRoles[0])) {
        return true;
      }
    }
  }
}
