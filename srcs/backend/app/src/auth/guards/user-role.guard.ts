import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if (!validRoles) {
      throw new ForbiddenException(`No valid roles defined for this route.`);
    }

    if (validRoles.length === 0) return true;

    const user = context.switchToHttp().getRequest().user;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hasValidRole = user.roles.some(role => validRoles.includes(role));
    if (hasValidRole) {
      return true;
    }
    throw new ForbiddenException(`User ${user.name} needs a valid role: [${validRoles.join(', ')}]`);
  }
}