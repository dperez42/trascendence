import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';

// Función decoradora Auth que aplica protección de roles y guarda el estado del usuario.
export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
