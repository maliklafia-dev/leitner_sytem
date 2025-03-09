import mongoose from "mongoose";
import dotenv from "dotenv";
import QuizModel from "../models/QuizModel.js";
import UserModel from "../models/UserModel.js";
import CardModel from "../models/CardModel.js";

dotenv.config();

const seedQuiz = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await UserModel.findOne();
    if (!user) {
      console.error("No user found! Please seed a user first.");
      process.exit(1);
    }

    const cards = await CardModel.find();
    if (cards.length === 0) {
      console.error("No cards found! Please seed cards first.");
      process.exit(1);
    }

    const quiz = new QuizModel({
      userId: user._id,
      date: new Date(),
      cards: cards.map((card) => card._id),
      responses: [],
    });

    await quiz.save();

    process.exit();
  } catch (error) {
    console.error("Error seeding quiz:", error);
    process.exit(1);
  }
};

seedQuiz();
