import{v4 as uuidv4} from 'uuid';

class Quiz {
    static STATUSES = {
        PENDING: 'PENDING',
        IN_PROGRESS: 'IN_PROGRESS',
        COMPLETED: 'COMPLETED'
    };

    #answers; // Stockage privé des réponses

    constructor({ userId, date, cards }) {
        this.validateProps({ userId, cards });

        this.id = uuidv4();
        this.userId = userId;
        this.date = date || new Date();
        this.cards = [...cards];
        this.status = Quiz.STATUSES.PENDING;
        this.startedAt = null;
        this.completedAt = null;
        this.#answers = new Map();
    }

    validateProps({ userId, cards }) {
        if (!userId) {
            throw new Error('UserId is required');
        }
        if (!Array.isArray(cards) || cards.length === 0) {
            throw new Error('Quiz must have at least one card');
        }
    }

    start() {
        if (this.status !== Quiz.STATUSES.PENDING) {
            throw new Error('Quiz can only be started when pending');
        }
        this.status = Quiz.STATUSES.IN_PROGRESS;
        this.startedAt = new Date();
    }

    complete() {
        if (this.status !== Quiz.STATUSES.IN_PROGRESS) {
            throw new Error('Quiz must be started before completion');
        }
        if (this.getRemainingCards().length > 0) {
            throw new Error('All cards must be answered before completion');
        }
        this.status = Quiz.STATUSES.COMPLETED;
        this.completedAt = new Date();
    }

    recordAnswer(cardId, isCorrect) {
        if (this.status !== Quiz.STATUSES.IN_PROGRESS) {
            throw new Error('Quiz must be in progress to record answers');
        }
        if (!this.cards.some(card => card.id === cardId)) {
            throw new Error('Card not found in quiz');
        }
        this.#answers.set(cardId, isCorrect);
    }

    getAnsweredCards() {
        return this.cards.filter(card => this.#answers.has(card.id));
    }

    getRemainingCards() {
        return this.cards.filter(card => !this.#answers.has(card.id));
    }

    getProgress() {
        const total = this.cards.length;
        const answered = this.getAnsweredCards().length;
        return {
            total,
            answered,
            remaining: total - answered,
            percentageComplete: (answered / total) * 100
        };
    }

    getAnswers() {
        return Array.from(this.#answers.entries()).map(([cardId, isCorrect]) => ({
            cardId,
            isCorrect
        }));
    }
}

export default Quiz;