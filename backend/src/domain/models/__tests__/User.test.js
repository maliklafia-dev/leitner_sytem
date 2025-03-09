import User from "../User.js";

describe("User Domain Entity", () => {
  describe("User Creation", () => {
    it("should create a valid user with required properties", () => {
      const userProps = {
        email: "test@example.com",
        password: "securePassword123",
        username: "testUser",
      };

      const user = new User(userProps);

      expect(user).toHaveProperty("id");
      expect(user.email).toBe(userProps.email);
      expect(user.username).toBe(userProps.username);
      expect(user.password).not.toBe(userProps.password); // Le mot de passe doit être haché
      expect(user.notificationTime).toBeNull();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it("should throw error if email is missing", () => {
      const invalidUser = {
        password: "securePassword123",
        username: "testUser",
      };

      expect(() => new User(invalidUser)).toThrow("Email is required");
    });

    it("should throw error if email format is invalid", () => {
      const invalidUser = {
        email: "invalid-email",
        password: "securePassword123",
        username: "testUser",
      };

      expect(() => new User(invalidUser)).toThrow("Invalid email format");
    });

    it("should throw error if password is too short", () => {
      const invalidUser = {
        email: "test@example.com",
        password: "short",
        username: "testUser",
      };

      expect(() => new User(invalidUser)).toThrow(
        "Password must be at least 8 characters long",
      );
    });
  });

  describe("Notification Management", () => {
    it("should allow setting notification time", () => {
      const user = new User({
        email: "test@example.com",
        password: "securePassword123",
        username: "testUser",
      });

      const notificationTime = "09:00";
      user.setNotificationTime(notificationTime);

      expect(user.notificationTime).toBe(notificationTime);
    });

    it("should validate notification time format", () => {
      const user = new User({
        email: "test@example.com",
        password: "securePassword123",
        username: "testUser",
      });

      expect(() => user.setNotificationTime("25:00")).toThrow(
        "Invalid time format",
      );
    });
  });

  describe("Password Management", () => {
    it("should correctly verify password", async () => {
      const userProps = {
        email: "test@example.com",
        password: "securePassword123",
        username: "testUser",
      };

      const user = new User(userProps);
      const isValid = await user.verifyPassword("securePassword123");

      expect(isValid).toBe(true);
    });

    it("should fail to verify incorrect password", async () => {
      const user = new User({
        email: "test@example.com",
        password: "securePassword123",
        username: "testUser",
      });

      const isValid = await user.verifyPassword("wrongPassword");

      expect(isValid).toBe(false);
    });
  });
});
