import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../enums/roles.enum';

@Injectable()
export class ValidUser implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const currentUser: User = request.user;
    const roles = currentUser.roles;
    const rolesType = roles.map((role) => role.type);
    const id = request.params.id;

    const student = Role.Student;
    const teacher = Role.Teacher;
    const manager = Role.Manager;

    if (rolesType.includes(manager) && requiredRoles.includes(manager)) {
      return true;
    }

    if (rolesType.includes(student) && requiredRoles.includes(student)) {
      if (currentUser.id !== id) {
        return false;
      }
      return true;
    }

    if (rolesType.includes(teacher) && requiredRoles.includes(teacher)) {
      if (currentUser.id !== id) {
        return false;
      }
      return true;
    }
  }
}
