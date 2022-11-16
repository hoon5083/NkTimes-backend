import { Module } from "@nestjs/common";
import { PopupsController } from "./popups.controller";
import { PopupsService } from "./popups.service";

@Module({
  controllers: [PopupsController],
  providers: [PopupsService],
})
export class PopupsModule {}
