import { ObjectId } from "mongodb";
import CardRepositoryPort from "../../../domain/ports/secondary/CardRepositoryPort.js";
import Card from "../../../domain/models/Card.js";

class CardRepository extends CardRepositoryPort {
  constructor(mongoClient) {
    super();
    this.collection = mongoClient.db.collection("cards");
  }

  async create(card) {
    const cardData = {
      _id: new ObjectId(),
      question: card.question,
      answer: card.answer,
      tag: card.tag,
      category:card.category,
      lastAnsweredAt: card.lastAnsweredAt,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };

    await this.collection.insertOne(cardData);
    return cardData;
  }

  async save(card) {
    const cardData = {
      question: card.question,
      answer: card.answer,
      tag: card.tag,
      category: card.category,
      lastAnsweredAt: card.lastAnsweredAt,
      updatedAt: new Date(),
    };

    const result = await this.collection.updateOne(
      { _id: new ObjectId(card.id) },
      { $set: cardData },
    );

    if (result.matchedCount === 0) {
      console.error("⚠️ No card found to update with ID:", card.id);
      throw new Error("Card not found");
    }

    return cardData;
  }

  async findById(id) {
    const objectId = new ObjectId(id.trim());
    const cardData = await this.collection.findOne({ _id: objectId });
    if (!cardData) {
      console.log("No card found in DB with this ID:", objectId);
      return null;
    }

    return new Card({
      id: cardData._id.toString(),
      question: cardData.question,
      answer: cardData.answer,
      tag: cardData.tag,
      category: cardData.category,
      lastAnsweredAt: cardData.lastAnsweredAt || null,
      createdAt: cardData.createdAt || new Date(),
      updatedAt: cardData.updatedAt || new Date(),
    });
  }

  async findAll() {
    const cardsData = await this.collection.find().toArray();
    return cardsData.map(
      (cardData) =>
        new Card({
          id: cardData._id,
          question: cardData.question,
          answer: cardData.answer,
          tag: cardData.tag,
          category: cardData.category,
          lastAnsweredAt: cardData.lastAnsweredAt,
          createdAt: cardData.createdAt,
          updatedAt: cardData.updatedAt,
        }),
    );
  }

  async delete(id) {
    const result = await this.collection.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async exists(id) {
    const count = await this.collection.countDocuments(
      { _id: id },
      { limit: 1 },
    );
    return count > 0;
  }
}

export default CardRepository;
