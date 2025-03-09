class CardServicePort {
  async getAllCards() {
    throw new Error("Method not implemented");
  }
  createCard(cardData) {
    throw new Error("Method not implemented");
  }

  getCardById(cardId) {
    throw new Error("Method not implemented");
  }

  updateCard(cardId, updatedData) {
    throw new Error("Method not implemented");
  }

  answerCardCorrectly(cardId) {
    throw new Error("Method not implemented");
  }

  answerCardIncorrectly(cardId) {
    throw new Error("Method not implemented");
  }
}

export default CardServicePort;
