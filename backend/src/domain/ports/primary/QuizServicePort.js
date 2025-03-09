class QuizServicePort {
  createQuiz(quizData) {
    throw new Error("Method not implemented.");
  }

  startQuiz(quizId) {
    throw new Error("Method not implemented.");
  }

  recordAnswer(quizId, cardId, isCorrect) {
    throw new Error("Method not implemented.");
  }

  getQuizProgress(quizId) {
    throw new Error("Method not implemented.");
  }

  completeQuiz(quizId) {
    throw new Error("Method not implemented.");
  }

  async hasTakenQuizToday(userId, date) {
    throw new Error("Method not implemented");
  }
}

module.exports = QuizServicePort;
