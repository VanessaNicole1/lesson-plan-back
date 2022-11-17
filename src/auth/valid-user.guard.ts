import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user-entity';
import { Role } from './enums/role.enum';

@Injectable()
export class ValidUser implements CanActivate {
  constructor(private reflector: Reflector, private config: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesKey = this.config.get('ROLES_KEY');
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(rolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    const student = this.config.get('STUDENT_TYPE');
    const teacher = this.config.get('TEACHER_TYPE');
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const currentUser: User = request.user;
    const roles = currentUser.roles;
    const rolesType = roles.map((role) => role.type);

    if (requiredRoles.includes(student)) {
      if (!rolesType.includes(student)) {
        return false;
      }
      if (currentUser.id !== id) {
        return false;
      }
      return true;
    }

    if (requiredRoles.includes(teacher)) {
      if (!rolesType.includes(teacher)) {
        return false;
      }
      if (currentUser.id !== id) {
        return false;
      }
      return true;
    }
  }
}
