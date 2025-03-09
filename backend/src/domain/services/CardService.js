import CardServicePort from "../ports/primary/CardServicePort.js";
import Card from "../models/Card.js";

class CardService extends CardServicePort {
  constructor(cardRepositoryPort) {
    super();
    this.cardRepository = cardRepositoryPort;
  }

  async getAllCards() {
    return await this.cardRepository.findAll();
  }

  async createCard(cardData) {
    if (!cardData.question || !cardData.answer) {
      throw new Error("Card must have both question and answer");
    }

    const card = new Card({
      category:"FIRST",
      question: cardData.question,
      answer: cardData.answer,
      tag: cardData.tag,
      
    });

    return  this.cardRepository.create(card);
  }

  async getCardById(cardId) {
    const card = await this.cardRepository.findById(cardId);
    if (!card) {
      throw new Error("Card not found");
    }
    return card;
  }

  async updateCard(cardId, updatedData) {
    const existingCard = await this.getCardById(cardId);
    const updatedCard = new Card({
      ...updatedData,
      id: cardId,
      category: existingCard.category,
      lastAnsweredAt: existingCard.lastAnsweredAt,
      createdAt: existingCard.createdAt,
    });
    return this.cardRepository.save(updatedCard);
  }

  async answerCard(cardId, isValid, userAnswer , forceValidation=false) {
    const card = await this.getCardById(cardId);

    if (!card) {
      throw new Error("Card not found");
    }

    let correctAnswer = card.answer;
    let result = { correctAnswer, userAnswer: userAnswer ?? "", isValid };

    if (!isValid) {
      card.category = "FIRST";
    } else {
      const nextCategory = {
        FIRST: "SECOND",
        SECOND: "THIRD",
        THIRD: "FOURTH",
        FOURTH: "FIFTH",
        FIFTH: "SIXTH",
        SIXTH: "SEVENTH",
        SEVENTH: "DONE",
      };

      if (!nextCategory[card.category]) {
        throw new Error(`Invalid category: ${card.category}`);
      }

      card.category = nextCategory[card.category] || "DONE";
    }

    card.lastAnsweredAt = new Date();
    return await this.cardRepository.save(card);
  }

  async getCardsForQuiz(date) {
    const allCards = await this.cardRepository.findAll();
    const targetDate = new Date(date).setHours(0, 0, 0, 0);
    const filteredCards = allCards.filter((card) => {
      if (card.category === "DONE") {
        return false;
      }
      if (!card.lastAnsweredAt) {
        return true;
      }
      const lastAnswered = new Date(card.lastAnsweredAt).setHours(0, 0, 0, 0);
      const daysSinceLastAnswer = Math.floor(
        (targetDate - lastAnswered) / (1000 * 60 * 60 * 24),
      );
      const reviewIntervals = {
        FIRST: 1,
        SECOND: 2,
        THIRD: 4,
        FOURTH: 8,
        FIFTH: 16,
        SIXTH: 32,
        SEVENTH: 64,
      };
      const requiredDays = reviewIntervals[card.category];
      const isDue = daysSinceLastAnswer >= requiredDays;
      return isDue;
    });
    return filteredCards;
  }
}

export default CardService;
