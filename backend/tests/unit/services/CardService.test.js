import CardService from "../../../src/domain/services/CardService.js";
import Card from "../../../src/domain/models/Card.js";

describe("CardService", () => {
  let cardService;
  let cardRepositoryMock;

  beforeEach(() => {
    cardRepositoryMock = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      create : jest.fn(),
    };
    cardService = new CardService(cardRepositoryMock);
  });

  test("should retrieve all cards", async () => {
    const mockCards = [{ id: "1", question: "Q1", answer: "A1" }];
    cardRepositoryMock.findAll.mockResolvedValue(mockCards);

    const cards = await cardService.getAllCards();
    expect(cards).toEqual(mockCards);
    expect(cardRepositoryMock.findAll).toHaveBeenCalledTimes(1);
  });

  test("should create a new card with category FIRST", async () => {
    const newCard = { question: "Q2", answer: "A2" };
    cardRepositoryMock.create.mockResolvedValue({
      ...newCard,
      category: "FIRST",
    });

    const result = await cardService.createCard(newCard);
    expect(result.category).toBe("FIRST");
    expect(cardRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...newCard,
        category: "FIRST"
      }),
    );
  });

  test("should throw an error if question or answer is missing", async () => {
    await expect(cardService.createCard({ question: "Q3" })).rejects.toThrow(
      "Card must have both question and answer",
    );
  });

  test("should return card if found", async () => {
    const mockCard = { id: "123", question: "Q", answer: "A",category: "FIRST" };
    cardRepositoryMock.findById.mockResolvedValue(mockCard);

    const card = await cardService.getCardById("123");
    expect(card).toEqual(mockCard);
  });

  test("should throw an error if card not found", async () => {
    cardRepositoryMock.findById.mockResolvedValue(null);

    await expect(cardService.getCardById("999")).rejects.toThrow(
      "Card not found",
    );
  });

  test("should update card and keep existing category and dates", async () => {
    const existingCard = {
      id: "1",
      question: "Old Question",
      answer: "Old Answer",
      category: "SECOND",
      lastAnsweredAt: new Date(),
      createdAt: new Date(),
    };

    const updateData = {
      question: "New Question",
      answer: "New Answer",
    };

    cardRepositoryMock.findById.mockResolvedValue(existingCard);
    cardRepositoryMock.save.mockResolvedValue({
      ...existingCard,
      ...updateData,
    });

    const updatedCard = await cardService.updateCard("1", updateData);

    expect(updatedCard.question).toBe(updateData.question);
    expect(updatedCard.answer).toBe(updateData.answer);
    expect(updatedCard.category).toBe(existingCard.category); // Ne doit pas changer
    expect(updatedCard.lastAnsweredAt).toEqual(existingCard.lastAnsweredAt);
    expect(cardRepositoryMock.save).toHaveBeenCalled();
  });

  test("should reset category to FIRST on incorrect answer", async () => {
    const mockCard = { id: "1", category: "THIRD", answer: "A" };
    cardRepositoryMock.findById.mockResolvedValue(mockCard);
    cardRepositoryMock.save.mockResolvedValue(mockCard);

    await cardService.answerCard("1", false, "Wrong answer", false);
    expect(mockCard.category).toBe("FIRST");
    expect(cardRepositoryMock.save).toHaveBeenCalled();
  });

  test("should move card to next category on correct answer", async () => {
    const mockCard = { id: "1", category: "FIRST", answer: "A" };
    cardRepositoryMock.findById.mockResolvedValue(mockCard);
    cardRepositoryMock.save.mockResolvedValue(mockCard);

    await cardService.answerCard("1", true, "Correct answer", false);
    expect(mockCard.category).toBe("SECOND");
    expect(cardRepositoryMock.save).toHaveBeenCalled();
  });


  test("should return quiz cards filtered by Leitner system", async () => {
    const today = new Date();
    const mockCards = [
      { id: "1", category: "FIRST", lastAnsweredAt: null },
      {
        id: "2",
        category: "SECOND",
        lastAnsweredAt: new Date(today - 3 * 24 * 60 * 60 * 1000),
      }, // doit être incluse
      {
        id: "3",
        category: "THIRD",
        lastAnsweredAt: new Date(today - 10 * 24 * 60 * 60 * 1000),
      }, // doit être incluse
    ];
    cardRepositoryMock.findAll.mockResolvedValue(mockCards);

    const quizCards = await cardService.getCardsForQuiz(today);
    expect(quizCards.length).toBe(3); // Toutes doivent être révisées
    expect(quizCards).toEqual(expect.arrayContaining(mockCards));
  });
});
