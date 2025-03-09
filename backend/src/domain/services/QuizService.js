import Quiz from "../models/Quiz.js";
import QuizServicePort from "../ports/primary/QuizServicePort.js";

class QuizService extends QuizServicePort {
  constructor(quizRepositoryPort) {
    super();
    this.quizes = new Map(); // Simule une base de données en mémoire
    this.quizRepositoryPort = quizRepositoryPort;
  }

  async hasTakenQuizToday(userId) {
    const today = new Date().setHours(0, 0, 0, 0);
    const quizzes = await this.quizRepositoryPort.findAll();

    return await quizzes.some(
      (quiz) =>
        quiz.userId === userId &&
        new Date(quiz.createdAt).setHours(0, 0, 0, 0) === today,
    );
  }

  async createQuiz(userId, quizData) {
    const today = new Date().setHours(0, 0, 0, 0);

    if (
      !quizData.cards ||
      !Array.isArray(quizData.cards) ||
      quizData.cards.length === 0
    ) {
      throw new Error("A quiz must contain at least one card");
    }

    if (await this.quizRepositoryPort.hasTakenQuizToday(userId, today)) {
      throw new Error("You have already taken a quiz today.");
    }

    const quiz = new Quiz({
      id: crypto.randomUUID(),
      userId,
      ...quizData,
      createdAt: new Date(),
      status: Quiz.STATUSES.PENDING,
    });

    await this.quizRepositoryPort.save(quiz);
    this.quizes.set(quiz.id, quiz);
    return quiz;
  }

  /*
    createQuiz(quizData) {
        const quiz = new Quiz(quizData);
        this.quizes.set(quiz.id, quiz);
        return quiz;
    }
     */

  async startQuiz(quizId) {
    const quiz = this.getQuizById(quizId);
    if (quiz.status !== Quiz.STATUSES.PENDING) {
      throw new Error("Quiz can only be started when pending");
    }

    quiz.status = Quiz.STATUSES.IN_PROGRESS;
    quiz.startedAt = new Date();
    this.quizes.set(quiz.id, quiz);

    return quiz;
  }

  recordAnswer(quizId, cardId, isCorrect) {
    const quiz = this.getQuizById(quizId);
    quiz.recordAnswer(cardId, isCorrect);
    return quiz;
  }

  completeQuiz(quizId) {
    const quiz = this.getQuizById(quizId);
    quiz.complete();
    return quiz;
  }

  getQuizProgress(quizId) {
    const quiz = this.getQuizById(quizId);
    return quiz.getProgress();
  }

  getQuizById(quizId) {
    if (!this.quizes.has(quizId)) {
      throw new Error("Quiz not found");
    }
    return this.quizes.get(quizId);
  }
}

export default QuizService;
