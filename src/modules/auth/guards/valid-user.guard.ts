import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { User } from 'src/modules/user/user-entity';
import { Role } from '../enums/role.enum';

@Injectable()
export class ValidUser implements CanActivate {
  constructor(private reflector: Reflector, private config: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesKey = this.config.get('ROLES_KEY');
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(rolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const currentUser: User = request.user;
    const roles = currentUser.roles;
    const rolesType = roles.map((role) => role.type);
    const id = request.params.id;

    const student = this.config.get('STUDENT_TYPE');
    const teacher = this.config.get('TEACHER_TYPE');
    const manager = this.config.get('MANAGER_TYPE');

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
