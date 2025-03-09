import mongoose from "mongoose";

const categories = [
  "FIRST",
  "SECOND",
  "THIRD",
  "FOURTH",
  "FIFTH",
  "SIXTH",
  "SEVENTH",
  "DONE",
];

const CardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  tag: { type: String },
  category: {
    type: String,
    enum: categories,
    default: "FIRST",
  },
  lastAnsweredAt: { type: Date, default: null },
});

const CardModel = mongoose.model("Card", CardSchema);

export default CardModel;
