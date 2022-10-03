import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  async getUsers(currentUser) {
    return { currentUser, api: "getusers" };
  }

  async createUser(currentUser) {
    return { currentUser, api: "createuser" };
  }

  async getMe(currentUser) {
    return { currentUser, api: "getme" };
  }

  async updateMe(currentUser) {
    return { currentUser, api: "updateme" };
  }

  async deleteMe(currentUser) {
    return { currentUser, api: "deleteme" };
  }

  async deleteUser(id: number, currentUser) {
    return { currentUser, id, api: "deleteUser" };
  }

  async updateUser(id: number, currentUser) {
    return { currentUser, id, api: "updateUser" };
  }
}
