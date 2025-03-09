import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, default: Date.now },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    responses: [
      {
        cardId: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
        isValid: { type: Boolean, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const QuizModel = mongoose.model("Quiz", QuizSchema);

export default QuizModel;
