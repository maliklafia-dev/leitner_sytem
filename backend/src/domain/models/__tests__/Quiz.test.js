import Card from "../Card.js";
import Quiz from "../Quiz.js";
const { v4: uuidv4 } = require("uuid");

describe("Quiz Domain Entity", () => {
  describe("Quiz Creation", () => {
    it("should create a quiz for a specific date", () => {
      const date = new Date("2024-01-27");
      const userId = "user123";
      const cards = [
        new Card({
          question: "Question 1",
          answer: "Answer 1",
          category: "FIRST",
        }),
      ];

      const quiz = new Quiz({ userId, date, cards });

      expect(quiz).toHaveProperty("id");
      expect(quiz.userId).toBe(userId);
      expect(quiz.date).toEqual(date);
      expect(quiz.cards).toHaveLength(1);
      expect(quiz.status).toBe("PENDING");
      expect(quiz.completedAt).toBeNull();
    });

    it("should not allow creating a quiz without cards", () => {
      const date = new Date("2024-01-27");
      const userId = "user123";

      expect(() => new Quiz({ userId, date, cards: [] })).toThrow(
        "Quiz must have at least one card",
      );
    });

    it("should not allow creating a quiz without userId", () => {
      const date = new Date("2024-01-27");
      const cards = [new Card({ question: "Q1", answer: "A1" })];

      expect(() => new Quiz({ date, cards })).toThrow("UserId is required");
    });
  });

  describe("Quiz Status Management", () => {
    let quiz;

    beforeEach(() => {
      const cards = [
        new Card({ id: uuidv4(), question: "Q1", answer: "A1" }),
        new Card({ id: uuidv4(), question: "Q2", answer: "A2" }),
      ];
      quiz = new Quiz({
        userId: "user123",
        date: new Date("2024-01-27"),
        cards,
      });
    });

    it("should start as PENDING", () => {
      expect(quiz.status).toBe("PENDING");
    });

    it("should change to IN_PROGRESS when started", () => {
      quiz.start();
      expect(quiz.status).toBe("IN_PROGRESS");
      expect(quiz.startedAt).toBeInstanceOf(Date);
    });

    it("should change to COMPLETED when finished", () => {
      quiz.start();

      quiz.recordAnswer(quiz.cards[0].id, true);
      quiz.recordAnswer(quiz.cards[1].id, true);

      quiz.complete();
      expect(quiz.status).toBe("COMPLETED");

      expect(quiz.completedAt).toBeInstanceOf(Date);
    });

    it("should not allow completing without starting", () => {
      expect(() => quiz.complete()).toThrow(
        "Quiz must be started before completion",
      );
    });
  });

  describe("Card Management", () => {
    it("should track answered cards", () => {
      const cards = [
        new Card({ question: "Q1", answer: "A1" }),
        new Card({ question: "Q2", answer: "A2" }),
      ];
      const quiz = new Quiz({
        userId: "user123",
        date: new Date("2024-01-27"),
        cards,
      });

      quiz.start();
      quiz.recordAnswer(cards[0].id, true);

      expect(quiz.getAnsweredCards()).toHaveLength(1);
      expect(quiz.getRemainingCards()).toHaveLength(1);
    });

    it("should provide progress information", () => {
      const cards = [
        new Card({ question: "Q1", answer: "A1" }),
        new Card({ question: "Q2", answer: "A2" }),
      ];
      const quiz = new Quiz({
        userId: "user123",
        date: new Date("2024-01-27"),
        cards,
      });

      quiz.start();
      quiz.recordAnswer(cards[0].id, true);

      const progress = quiz.getProgress();
      expect(progress.total).toBe(2);
      expect(progress.answered).toBe(1);
      expect(progress.remaining).toBe(1);
      expect(progress.percentageComplete).toBe(50);
    });
  });
});
