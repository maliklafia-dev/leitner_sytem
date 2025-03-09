import QuizRepositoryPort from "../../../domain/ports/secondary/QuizRepositoryPort.js";
import Quiz from "../../../domain/models/Quiz.js";

class QuizRepository extends QuizRepositoryPort {
  constructor(mongoClient) {
    super();
    this.collection = mongoClient.db.collection("quizes");
  }

  async findAll() {
    const quizesData = await this.collection.find().toArray();
    return quizesData.map(
      (data) =>
        new Quiz({
          id: data._id,
          name: data.name,
          questions: data.questions,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }),
    );
  }

  async findById(id) {
    const quizData = await this.collection.findOne({ _id: id });
    if (!quizData) return null;
    return new quiz({
      id: quizData._id,
      name: quizData.name,
      questions: quizData.questions,
      createdAt: quizData.createdAt,
      updatedAt: quizData.updatedAt,
    });
  }

  async save(quiz) {
    const quizData = {
      _id: quiz.id,
      name: quiz.name,
      questions: quiz.questions,
      createdAt: quiz.createdAt,
      updatedAt: new Date(),
    };

    await this.collection.updateOne(
      { _id: quizData._id },
      { $set: quizData },
      { upsert: true },
    );

    return quiz;
  }

  async delete(id) {
    const result = await this.collection.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async hasTakenQuizToday(userId, date) {
    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    const endOfDay = new Date(date).setHours(23, 59, 59, 999);

    const quiz = await this.collection.findOne({
      userId: userId,
      createdAt: { $gte: new Date(startOfDay), $lte: new Date(endOfDay) },
    });

    return quiz !== null;
  }
}

export default QuizRepository;
