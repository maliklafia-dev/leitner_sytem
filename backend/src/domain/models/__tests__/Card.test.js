import Card from "../Card.js";

describe("Card Domain Entity", () => {
  describe("Card Creation", () => {
    it("should create a valid card with required properties", () => {
      const cardProps = {
        question: "What is TDD?",
        answer: "Test Driven Development",
        tag: "methodology",
      };

      const card = new Card(cardProps);

      expect(card).toHaveProperty("id");
      expect(card.question).toBe(cardProps.question);
      expect(card.answer).toBe(cardProps.answer);
      expect(card.tag).toBe(cardProps.tag);
      expect(card.category).toBe("FIRST");
      expect(card.lastAnsweredAt).toBeNull();
    });

    it("should throw error if question is missing", () => {
      const invalidCard = {
        answer: "Test Driven Development",
        tag: "methodology",
      };

      expect(() => new Card(invalidCard)).toThrow("Question is required");
    });

    it("should throw error if answer is missing", () => {
      const invalidCard = {
        question: "What is TDD?",
        tag: "methodology",
      };

      expect(() => new Card(invalidCard)).toThrow("Answer is required");
    });

    it("should accept card without tag", () => {
      const cardProps = {
        question: "What is TDD?",
        answer: "Test Driven Development",
      };

      const card = new Card(cardProps);
      expect(card.tag).toBeUndefined();
    });
  });

  describe("Category Management", () => {
    it("should progress through categories correctly when answering correctly", () => {
      const card = new Card({
        question: "What is TDD?",
        answer: "Test Driven Development",
      });

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
      let currentDate = new Date("2024-01-27");

      // Mock Date.now() to control the timestamps
      jest.spyOn(global, "Date").mockImplementation(() => currentDate);

      categories.forEach((expectedCategory, index) => {
        if (index > 0) {
          card.answerCorrectly();
          expect(card.category).toBe(expectedCategory);
          expect(card.lastAnsweredAt).toEqual(currentDate);
        }
      });

      // Additional correct answer should keep it in DONE
      card.answerCorrectly();
      expect(card.category).toBe("DONE");
    });

    it("should reset to FIRST category when answered incorrectly", () => {
      const card = new Card({
        question: "What is TDD?",
        answer: "Test Driven Development",
      });

      // Progress to THIRD
      card.answerCorrectly(); // SECOND
      card.answerCorrectly(); // THIRD

      expect(card.category).toBe("THIRD");

      // Answer incorrectly
      card.answerIncorrectly();
      expect(card.category).toBe("FIRST");
    });
  });

  describe("Answer Validation", () => {
    it("should track last answered date", () => {
      const card = new Card({
        question: "What is TDD?",
        answer: "Test Driven Development",
      });

      const answerDate = new Date("2024-01-27");
      jest.spyOn(global, "Date").mockImplementation(() => answerDate);

      card.answerCorrectly();
      expect(card.lastAnsweredAt).toEqual(answerDate);
    });
  });
});
