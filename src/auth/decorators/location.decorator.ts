import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Location } from '@prisma/client';

export const CurrentLocation = createParamDecorator(
  (data: keyof Location, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const location = request.location;

    return data ? location[data] : location;
  }
);