
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log("RolesGuard");
    const role = this.reflector.get(Roles, context.getHandler());
    console.log(role);
    if (!role) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log("user ===", user);
    if (!user) {
      throw new ForbiddenException();
    }
    console.log(user);
    console.log(request['user']);
    return this.matchRoles(role, user.role);
  }

  matchRoles(roles: string, userRole: string): boolean {
    if (roles === userRole) {
      return true;
    }
    return false;
  }
}
