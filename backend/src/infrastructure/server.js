/* eslint-disable prettier/prettier */
// import express from 'express';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import CardController from '../adapters/primary/CardController.js';
// import CardService from '../domain/services/CardService.js';
// import CardRepository from '../adapters/secondary/repositories/CardRepository.js';
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import QuizRepository from '../adapters/secondary/repositories/QuizRepository.js';
// import QuizService from '../domain/services/QuizService.js';
// dotenv.config();

// console.log("Starting server...");
// const app = express();

// app.use(express.json());

// const PORT = process.env.PORT || 8080;
// const swaggerOptions = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Card API',
//             version: '1.0.0',
//             description: 'API for managing flashcards',
//         },
//     },
//     apis: ['./src/adapters/primary/CardController.js'],
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// const connectDB = async () => {
//     try {
//         if (!process.env.MONGODB_URI) {
//             throw new Error('MongoDB URI is not defined in environment variables');
//         }
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("MongoDB Connected");

//         const cardRepository = new CardRepository(mongoose.connection);
//         const cardService = new CardService(cardRepository);
//         const cardController = new CardController(cardService);
//         app.use('/cards', cardController.getRouter());

//         const quizRepository = new QuizRepository(mongoose.connection);
//         const quizService = new QuizService(quizRepository);
//         } catch (error) {
//         console.error("MongoDB Connection Error:", error);
//         process.exit(1);
//     }
// };

// await connectDB();

// app.get("/", (req, res) => {
//     console.log("Route accessed");
//     res.send("Connected to MongoDB - Server is running successfully!");
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         message: 'Something went wrong!',
//         error: err.message
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server ==> http://localhost:${PORT}`);
// });

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import CardController from "../adapters/primary/CardController.js";
import CardService from "../domain/services/CardService.js";
import CardRepository from "../adapters/secondary/repositories/CardRepository.js";

// Load env vars before anything else
dotenv.config();

console.log("Starting server...");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.BASE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Card API",
      version: "1.0.0",
      description: "API for managing flashcards",
    },
    servers: [
      {
        url: `${BASE_URL}:${PORT}`,
        description: "Development server",
      }]
    },
    apis: ['./src/adapters/primary/CardController.js'] // Path to API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const allowedOrigins = [
    FRONTEND_URL,
    `${BASE_URL}/api-docs`, //swagger
]

app.use(
    cors({
        origin: function (origin, callback) {
            if(!origin || allowedOrigins.includes(origin)) {
                callback(null, origin);
            } else {
                callback(null, Error("Not allowed by Cors"));
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Database connection
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
        const cardRepository = new CardRepository(mongoose.connection);
        const cardService = new CardService(cardRepository);
        const cardController = new CardController(cardService);
        app.use('/', cardController.router);
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

// Start server
const startServer = async () => {
    try {
        await connectDB();
        
        app.get("/", (req, res) => {
            console.log("Route accessed");
            res.send("Connected to MongoDB - Server is running successfully!");
        });
        
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({
                message: 'Something went wrong!',
                error: err.message
            });
        });
        
        app.listen(PORT, () => {
            console.log(`Server ==> http://localhost:${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();