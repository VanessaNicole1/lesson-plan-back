import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../enums/roles.enum';

@Injectable()
export class ValidUser implements CanActivate {
  constructor(private reflector: Reflector) {}
  //@ts-ignore
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const currentUser: User = request.user;
    const roles = currentUser.roles;
    const userRoles = roles.map((role) => role.name);
    const id = request.params.id;
    const manager = Role.Manager;

    if (userRoles.includes(manager)) {
      return true;
    }

    for (const role of userRoles) {
      if (requiredRoles.includes(role) && currentUser.id === id) {
        return true;
      }
    }
  }
}
