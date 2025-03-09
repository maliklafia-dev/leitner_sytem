import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";

dotenv.config();

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    const existingUser = await UserModel.findOne({
      email: "rrrrr@example.com",
    });
    if (existingUser) {
      console.log("User already exists. Skipping seeding.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("rrrrr", 10);

    const user = new UserModel({
      email: "rrrr@example.com",
      username: "rrr",
      password: hashedPassword,
    });

    await user.save();
    console.log("User seeded successfully:", user);

    process.exit();
  } catch (error) {
    console.error("Error seeding user:", error);
    process.exit(1);
  }
};

seedUser();
