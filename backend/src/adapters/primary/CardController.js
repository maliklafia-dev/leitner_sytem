import express from "express";
/**
 * @swagger
 * openapi: 3.0.3
 * info:
 *   title: Leitner system
 *   description: >
 *     This API aim to provide feature to manage a graphical interface
 *     for Leitner System.
 *   version: 1.0.0
 * servers:
 *   - url: http://localhost:8080
 *     description: Local server
 * paths:
 *   /cards:
 *     get:
 *       tags:
 *         - Cards
 *       summary: Get all cards
 *       description: Used to fetch every cards with given tags. If no tags are provided, will fetch all cards.
 *       parameters:
 *         - in: query
 *           name: tags
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *           description: Tags of cards to find. If not present, all cards will be found.
 *           example: tag1,tag2
 *       responses:
 *         '200':
 *           description: Found cards by tag query
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Card"
 *     post:
 *       tags:
 *         - Cards
 *       summary: Create a card
 *       description: Used to create a new card in the system. A new card will be present in the next quizz.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CardUserData"
 *       responses:
 *         '201':
 *           description: Created card
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Card"
 *         '400':
 *           description: Bad request
 *   /cards/quizz:
 *     get:
 *       tags:
 *         - Learning
 *       summary: Cards for the day
 *       description: Used to fetch all cards for a quizz at a given date. If no date is provided, quizz will be for today.
 *       parameters:
 *         - in: query
 *           name: date
 *           description: Date of quizz. If not provided, date will be today.
 *           example: 2023-11-03
 *           schema:
 *             type: string
 *             format: date
 *       responses:
 *         '200':
 *           description: All cards of quizz for today
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Card"
 *   /cards/{cardId}/answer:
 *     patch:
 *       tags:
 *         - Learning
 *       summary: Answer a question
 *       description: Used to answer a question. Body indicate if user has answered correctly or not.
 *       parameters:
 *         - in: path
 *           name: cardId
 *           required: true
 *           description: Id of answered card.
 *           schema:
 *             $ref: "#/components/schemas/CardId"
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: ["isValid"]
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                   description: True if user has answered correctly, false otherwise
 *       responses:
 *         '204':
 *           description: Answer has been taken into account
 *         '400':
 *           description: Bad request
 *         '404':
 *           description: Card not found
 * components:
 *   schemas:
 *     CardId:
 *       type: string
 *       description: Generated identifier of a card
 *       example: 592db6b8-3840-4705-806e-33e4ae21f26b
 *     CardUserData:
 *       type: object
 *       required:
 *         - question
 *         - answer
 *       properties:
 *         question:
 *           type: string
 *           description: Question to be asked to the user during a quizz
 *           example: "What is pair programming ?"
 *         answer:
 *           type: string
 *           description: Expected answer for the question
 *           example: "A practice to work in pair on same computer."
 *         tag:
 *           type: string
 *           description: A tag to group cards on same topic
 *           example: "Teamwork"
 *     Card:
 *       allOf:
 *         - type: object
 *           required: ["id", "category"]
 *           properties:
 *             id:
 *               $ref: "#/components/schemas/CardId"
 *             category:
 *               $ref: "#/components/schemas/Category"
 *         - $ref: "#/components/schemas/CardUserData"
 *     Category:
 *       type: string
 *       description: Category of card indicating how many times you answered it and appearance frequency
 *       example: FIRST
 *       enum:
 *         - FIRST
 *         - SECOND
 *         - THIRD
 *         - FOURTH
 *         - FIFTH
 *         - SIXTH
 *         - SEVENTH
 *         - DONE
 */
class CardController {
  constructor(cardService) {
    this.router = express.Router();
    this.cardService = cardService;
    this.router.get("/cards", this.getAllCards.bind(this));
    this.router.post("/cards", this.createCard.bind(this));
    this.router.get("/cards/quizz", this.getQuizCards.bind(this));
    this.router.patch("/cards/:cardId/answer", this.answerCard.bind(this));
  }

  async getAllCards(req, res) {
    try {
      const tags = req.query.tags ? req.query.tags.split(",") : [];
      const cards = await this.cardService.getAllCards(tags);
      res.status(200).json(cards);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async createCard(req, res) {
    try {
      if (!req.body || !req.body.question || !req.body.answer) {
        return res.status(400).json({
          error: "Invalid data",
        });
      }
      const newCard = await this.cardService.createCard(req.body);
      res.status(201).json(newCard);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getQuizCards(req, res) {
    try {
      const date = req.query.date ? new Date(req.query.date) : new Date();
      const cards = await this.cardService.getCardsForQuiz(date);
      res.status(200).json(cards);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async answerCard(req, res) {
    try {
      const { isValid, userAnswer } = req.body;
      if (isValid === undefined) {
        return res.status(400).json({ error: "isValid is required" });
      }

      const card = await this.cardService.answerCard(
        req.params.cardId,
        isValid,
        userAnswer,
      );

      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }

      res.status(204).send();
    } catch (error) {
      if (error.message === "Card not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
}

export default CardController;
