import UserService from "../../../src/domain/services/UserService.js";
import User from "../../../src/domain/models/User.js";

describe("UserService", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  test("should create a new user", () => {
    const userData = {
      email: "test@example.com",
      username: "testUser",
      password: "password123",
    };
    const user = userService.createUser(userData);

    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe(userData.email);
    expect(user.username).toBe(userData.username);
    expect(userService.getUserById(user.id)).toEqual(user);
  });

  test("should retrieve a user by ID", () => {
    const userData = {
      email: "user@example.com",
      username: "userTest",
      password: "securePass",
    };
    const createdUser = userService.createUser(userData);

    const retrievedUser = userService.getUserById(createdUser.id);
    expect(retrievedUser).toEqual(createdUser);
  });

  test("should authenticate a user with correct credentials", async () => {
    const userData = {
      email: "auth@test.com",
      username: "authUser",
      password: "securePass123",
    };
    userService.createUser(userData);

    const isAuthenticated = await userService.authenticateUser(
      userData.email,
      userData.password,
    );
    expect(isAuthenticated).toBeTruthy();
  });

  test("should not authenticate a user with incorrect credentials", async () => {
    const userData = {
      email: "wrong@test.com",
      username: "wrongUser",
      password: "correctPass",
    };
    userService.createUser(userData);

    const isAuthenticated = await userService.authenticateUser(
      userData.email,
      "wrongPass",
    );
    expect(isAuthenticated).toBeFalsy();
  });

  test("should throw an error if user not found", () => {
    expect(() => userService.getUserById("nonexistent-id")).toThrow(
      "User not found",
    );
  });

  test("should set notification time for a user", () => {
    const userData = {
      email: "notify@test.com",
      username: "notifyUser",
      password: "passwordNotif",
    };
    const user = userService.createUser(userData);

    userService.setNotificationTime(user.id, "08:30");

    expect(user.notificationTime).toBe("08:30");
  });

  test("should throw an error for invalid notification time format", () => {
    const userData = {
      email: "invalid@test.com",
      username: "invalidUser",
      password: "pass1234",
    };
    const user = userService.createUser(userData);

    expect(() =>
      userService.setNotificationTime(user.id, "invalid-time"),
    ).toThrow("Invalid time format");
  });
});
