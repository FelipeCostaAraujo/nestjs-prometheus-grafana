import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string>();

/*import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
*/