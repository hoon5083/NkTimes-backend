import { PassportStrategy } from "@nestjs/passport";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-custom";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { OAuth2Client } from "google-auth-library";

const BEARER_AUTH_SCHEME = "Bearer ";
const AUTHORIZATION = "authorization";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private configService: ConfigService) {
    super();
  }

  async validate(req: Request) {
    const token =
      req.headers[AUTHORIZATION]?.startsWith(BEARER_AUTH_SCHEME) &&
      req.headers[AUTHORIZATION].substring(BEARER_AUTH_SCHEME.length);

    if (!token) {
      throw new UnauthorizedException("No Bearer Token in Authorization Header");
    }

    try {
      const client = new OAuth2Client(this.configService.get("google.clientID"));

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: this.configService.get("google.clientID"),
      });
      const payload = ticket.getPayload();

      if (!payload) {
        throw new BadRequestException("No payload in JWT");
      }

      return { email: payload.email };
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new BadRequestException("Invalid JWT");
      }
      if (error.message.includes("Token used too late")) {
        throw new UnauthorizedException("Expired JWT");
      }
      throw error;
    }
  }
}
