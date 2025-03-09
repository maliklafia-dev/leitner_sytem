const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class User {
    #password; // Propriété privée pour le mot de passe haché

    constructor(props) {
        this.validateProps(props);

        this.id = uuidv4();
        this.email = props.email;
        this.username = props.username;
        this.#password = this.hashPassword(props.password);
        this.notificationTime = null;
        this.createdAt = new Date();
    }

    validateProps(props) {
        if (!props.email) {
            throw new Error('Email is required');
        }
        if (!this.isValidEmail(props.email)) {
            throw new Error('Invalid email format');
        }
        if (!props.password || props.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidTime(time) {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    }

    hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }

    async verifyPassword(password) {
        return bcrypt.compare(password, this.#password);
    }

    setNotificationTime(time) {
        if (!this.isValidTime(time)) {
            throw new Error('Invalid time format');
        }
        this.notificationTime = time;
    }
}


export default User;