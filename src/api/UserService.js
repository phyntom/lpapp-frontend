import { instance } from "./MainService";
import AuthService from "../api/AuthService";

class UserService {
  addUser = async user => {
    return await instance.post("/api/users", JSON.stringify(user), {
      headers: {
        Authorization: AuthService.getAccessToken(),
        "Content-Type": "application/json"
      }
    });
  };

  editUser = async user => {
    return instance.put("/api/users", JSON.stringify(user), {
      headers: {
        Authorization: AuthService.getAccessToken(),
        "Content-Type": "application/json"
      }
    });
  };

  removeUser = async userId => {
    return await instance.delete(`/api/users/${userId}`, {
      headers: {
        Authorization: AuthService.getAccessToken(),
        "Content-Type": "application/json"
      }
    });
  };

  getAllUsers = async () => {
    return await instance.get("/api/users", {
      timeout: 60000,
      headers: {
        Authorization: AuthService.getAccessToken(),
        "Content-Type": "application/json"
      }
    });
  };

  getAllRoles = async () => {
    return await instance.get("/api/roles", {
      headers: {
        Authorization: AuthService.getAccessToken(),
        "Content-Type": "application/json"
      }
    });
  };
}

export default new UserService();
