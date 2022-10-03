import { Injectable, mixin, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export const GoogleAuthGuard = (options?: { strict: boolean }): any => {
  @Injectable()
  class GoogleAuthGuardMixin extends AuthGuard("google") {
    strict: boolean = options?.strict;

    handleRequest(err, user, info) {
      if (err || !user) {
        if (!this.strict && err.message === "No Bearer Token in Authorization Header") {
          return { email: null };
        }
        throw err || new UnauthorizedException(info);
      }
      return user;
    }
  }

  return mixin(GoogleAuthGuardMixin);
};
