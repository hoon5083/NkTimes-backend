import { Module } from "@nestjs/common";
import { GoogleStrategy } from "./google/google.strategy";

@Module({ providers: [GoogleStrategy] })
export class AuthModule {}
