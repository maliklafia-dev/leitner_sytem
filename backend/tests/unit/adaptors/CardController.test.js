import request from "supertest";
import express from "express";
import CardController from "../../../src/adapters/primary/CardController.js";

describe("CardController", () => {
  let app;
  let cardServiceMock;

  beforeEach(() => {
    cardServiceMock = {
      getAllCards: jest.fn(),
      createCard: jest.fn(),
      getCardsForQuiz: jest.fn(),
      answerCard: jest.fn(),
    };

    app = express();
    app.use(express.json());
    const controller = new CardController(cardServiceMock);
    app.use("/api", controller.router);
  });

  // TESTER `GET /cards`
  test("GET /api/cards should return all cards", async () => {
    const mockCards = [{ id: "1", question: "Q1", answer: "A1" }];
    cardServiceMock.getAllCards.mockResolvedValue(mockCards);

    const response = await request(app).get("/api/cards");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCards);
    expect(cardServiceMock.getAllCards).toHaveBeenCalledTimes(1);
  });

  test("GET /api/cards should return 500 on error", async () => {
    cardServiceMock.getAllCards.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/cards");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Database error");
  });

  // ✅ 2️⃣ TESTER `POST /cards`
  test("POST /api/cards should create a new card", async () => {
    const newCard = { question: "Q2", answer: "A2" };
    cardServiceMock.createCard.mockResolvedValue({
      ...newCard,
      id: "2",
      category: "FIRST",
    });

    const response = await request(app).post("/api/cards").send(newCard);
    expect(response.status).toBe(201);
    expect(response.body.category).toBe("FIRST");
  });

  test("POST /api/cards should return 400 if invalid data", async () => {
    cardServiceMock.createCard.mockRejectedValue(new Error("Invalid data"));

    const response = await request(app)
      .post("/api/cards")
      .send({ question: "Q3" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid data");
  });

  //TESTER `GET /cards/quizz`
  test("GET /api/cards/quizz should return quiz cards", async () => {
    const mockQuizCards = [{ id: "1", question: "Q1", answer: "A1" }];
    cardServiceMock.getCardsForQuiz.mockResolvedValue(mockQuizCards);

    const response = await request(app).get("/api/cards/quizz");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuizCards);
  });

  test("GET /api/cards/quizz should return 400 on error", async () => {
    cardServiceMock.getCardsForQuiz.mockRejectedValue(
      new Error("Invalid date"),
    );

    const response = await request(app).get("/api/cards/quizz");
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid date");
  });


  test("PATCH /api/cards/:cardId/answer should return 204", async () => {
    cardServiceMock.answerCard.mockResolvedValue({
      category: "SECOND",
      correctAnswer: "answer",
      userAnswer: "answer",
      isValid: true
    });
    
    const response = await request(app)
      .patch("/api/cards/1/answer")
      .send({ isValid: true });

    expect(response.status).toBe(204);
  });

 

  test("PATCH /api/cards/:cardId/answer should return 400 if isValid is missing", async () => {
    const response = await request(app).patch("/api/cards/1/answer").send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("isValid is required");
  });

  test("PATCH /api/cards/:cardId/answer should return 404 if card not found", async () => {
    cardServiceMock.answerCard.mockRejectedValue(new Error("Card not found"));

    const response = await request(app)
      .patch("/api/cards/999/answer")
      .send({ isValid: true });

    expect(response.status).toBe(404);
  });

  test("PATCH /api/cards/:cardId/answer should return 400 on error", async () => {
    cardServiceMock.answerCard.mockRejectedValue(new Error("Invalid request"));

    const response = await request(app)
      .patch("/api/cards/1/answer")
      .send({ isValid: true });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid request");
  });
});
