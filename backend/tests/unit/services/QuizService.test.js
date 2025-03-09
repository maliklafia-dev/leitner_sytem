import QuizService from "../../../src/domain/services/QuizService.js";
import Quiz from "../../../src/domain/models/Quiz.js";
import Card from "../../../src/domain/models/Card.js";

describe("QuizService", () => {
  let quizService;
  let card1, card2, card3;
  let quizRepositoryPortMock;

  beforeEach(() => {
    quizRepositoryPortMock = {
      hasTakenQuizToday: jest.fn(),
      save: jest.fn(),
    };

    quizService = new QuizService(quizRepositoryPortMock);

    // Créons des cartes fictives
    card1 = new Card({
      question: "What is TDD?",
      answer: "Test-Driven Development",
      tag: "testing",
    });
    card2 = new Card({
      question: "What is SOLID?",
      answer: "Principles of OOP",
      tag: "design",
    });
    card3 = new Card({
      question: "What is DDD?",
      answer: "Domain-Driven Design",
      tag: "architecture",
    });
  });

  test("should create a new quiz", async () => {
    quizRepositoryPortMock.hasTakenQuizToday.mockResolvedValue(false);
    quizRepositoryPortMock.save.mockResolvedValue({
      id: "quiz1",
      userId: "user1",
    });

    const quizData = { title: "Quiz 1", cards: [card1, card2] }; // ✅ Correction ici
    const quiz = await quizService.createQuiz("user1", quizData);

    expect(quiz).toBeInstanceOf(Quiz);
    expect(quiz.cards.length).toBe(2);
    expect(quiz.status).toBe(Quiz.STATUSES.PENDING);
  });

  test("should start a quiz", async () => {
    quizRepositoryPortMock.hasTakenQuizToday.mockResolvedValue(false);
    quizRepositoryPortMock.save.mockResolvedValue({
      id: "quiz1",
      userId: "user1",
    });

    const quizData = { title: "Quiz 1", cards: [card1, card2] };
    const quiz = await quizService.createQuiz("user1", quizData);
    quizService.quizes.set(quiz.id, quiz);

    const startedQuiz = await quizService.startQuiz(quiz.id);
    expect(startedQuiz.status).toBe(Quiz.STATUSES.IN_PROGRESS);
  });

  test("should record an answer", async () => {
    const quizData = { userId: "user123", cards: [card1, card2] };
    const quiz = await quizService.createQuiz("user123", quizData);
    quizService.quizes.set(quiz.id, quiz);

    await quizService.startQuiz(quiz.id);
    quizService.recordAnswer(quiz.id, card1.id, true);

    expect(quiz.getAnsweredCards().length).toBe(1);
    expect(quiz.getRemainingCards().length).toBe(1);
  });

  test("should complete a quiz when all cards are answered", async () => {
    const quizData = { userId: "user123", cards: [card1, card2] };
    const quiz = await quizService.createQuiz("user123", quizData);
    quizService.quizes.set(quiz.id, quiz);

    await quizService.startQuiz(quiz.id);
    quizService.recordAnswer(quiz.id, card1.id, true);
    quizService.recordAnswer(quiz.id, card2.id, false);

    await quizService.completeQuiz(quiz.id);
    expect(quiz.status).toBe(Quiz.STATUSES.COMPLETED);
    expect(quiz.completedAt).not.toBeNull();
  });

  test("should throw error when starting an already started quiz", async () => {
    quizRepositoryPortMock.hasTakenQuizToday.mockResolvedValue(false);
    quizRepositoryPortMock.save.mockResolvedValue({
      id: "quiz1",
      userId: "user1",
    });

    const quizData = { title: "Quiz 1", cards: [card1, card2] };
    const quiz = await quizService.createQuiz("user1", quizData);
    quizService.quizes.set(quiz.id, quiz);

    await quizService.startQuiz(quiz.id);
    const startedQuiz = quizService.getQuizById(quiz.id);

    expect(startedQuiz.status).toBe(Quiz.STATUSES.IN_PROGRESS);

    // ✅ Vérification que le second appel déclenche bien une erreur
    await expect(quizService.startQuiz(quiz.id)).rejects.toThrow(
      "Quiz can only be started when pending",
    );
  });

  test("should throw error if quiz not found", async () => {
    await expect(() => quizService.getQuizProgress("nonexistent-id")).toThrow(
      "Quiz not found",
    );
  });

  test("should not allow multiple quizzes on the same day", async () => {
    quizRepositoryPortMock.hasTakenQuizToday.mockResolvedValue(true);

    await expect(
      quizService.createQuiz("user1", { title: "Quiz 1", cards: [card1] }),
    ).rejects.toThrow("You have already taken a quiz today.");
  });

  test("should create a new quiz if not already taken today", async () => {
    quizRepositoryPortMock.hasTakenQuizToday.mockResolvedValue(false);
    quizRepositoryPortMock.save.mockResolvedValue({
      id: "quiz1",
      userId: "user1",
    });

    const quiz = await quizService.createQuiz("user1", {
      title: "Quiz 1",
      cards: [card1],
    });

    expect(quiz.userId).toBe("user1");
    expect(quizRepositoryPortMock.save).toHaveBeenCalled();
  });
});
