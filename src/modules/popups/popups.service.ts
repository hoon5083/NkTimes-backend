import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class PopupsService {
  constructor(private readonly dataSource: DataSource) {}

  async createPopup(currentUser) {
    return "createPopup";
  }

  async getPopup(currentUser) {
    return "getPopup";
  }
}
