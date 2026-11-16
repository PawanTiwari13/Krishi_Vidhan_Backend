import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RoleType } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: RoleType[];
  stateId: number;
  divisionId: number;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthenticatedUser | undefined = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);

