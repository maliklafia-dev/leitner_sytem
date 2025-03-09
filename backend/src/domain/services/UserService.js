import User from "../models/User.js";

class UserService {
  constructor() {
    this.users = new Map(); // Simule une base de données en mémoire
  }

  createUser(userData) {
    const user = new User(userData);
    this.users.set(user.id, user);
    return user;
  }

  getUserById(userId) {
    if (!this.users.has(userId)) {
      throw new Error("User not found");
    }
    return this.users.get(userId);
  }

  async authenticateUser(email, password) {
    const user = [...this.users.values()].find((u) => u.email === email);
    if (!user) {
      return false;
    }
    return await user.verifyPassword(password);
  }

  setNotificationTime(userId, time) {
    const user = this.getUserById(userId);
    user.setNotificationTime(time);
  }
}

export default UserService;
