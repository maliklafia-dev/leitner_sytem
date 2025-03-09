import mongoose from "mongoose";
import dotenv from "dotenv";
import CardModel from "../models/CardModel.js";

dotenv.config();

const seedCards = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const cards = [
      // tag : AGILE
      {
        question: "What is Pair Programming?",
        answer: "Working in pairs on the same task.",
        tag: "Agile",
        category: "FIRST",
      },
      {
        question: "What is Scrum?",
        answer: "A framework for Agile development.",
        tag: "Agile",
        category: "FIRST",
      },
      {
        question: "What are Agile values?",
        answer:
          "Individuals and interactions, working software, customer collaboration, responding to change.",
        tag: "Agile",
        category: "FIRST",
      },
      {
        question: "What is a Sprint in Agile?",
        answer: "A short development cycle in Scrum.",
        tag: "Agile",
        category: "FIRST",
      },
      {
        question: "What is a Product Backlog?",
        answer: "A prioritized list of features or user stories in Agile.",
        tag: "Agile",
        category: "FIRST",
      },

      // tag : API
      {
        question: "What is a RESTful API?",
        answer: "An API that follows REST principles.",
        tag: "API",
        category: "FIRST",
      },
      {
        question: "What is GraphQL?",
        answer: "A query language for APIs allowing flexible data retrieval.",
        tag: "API",
        category: "FIRST",
      },
      {
        question: "What is an API Endpoint?",
        answer: "A specific URL where an API can be accessed.",
        tag: "API",
        category: "FIRST",
      },
      {
        question: "What is the difference between REST and SOAP?",
        answer:
          "REST is lightweight, uses JSON, SOAP is heavier and XML-based.",
        tag: "API",
        category: "FIRST",
      },
      {
        question: "What is CORS in APIs?",
        answer:
          "Cross-Origin Resource Sharing, a security feature for web APIs.",
        tag: "API",
        category: "FIRST",
      },

      // tag : TESTING
      {
        question: "What is Unit Testing?",
        answer: "Testing individual components in isolation.",
        tag: "Testing",
        category: "FIRST",
      },
      {
        question: "What is Integration Testing?",
        answer: "Testing how multiple modules work together.",
        tag: "Testing",
        category: "FIRST",
      },
      {
        question: "What is Mocking in Testing?",
        answer: "Simulating dependencies for controlled testing.",
        tag: "Testing",
        category: "FIRST",
      },
      {
        question: "What is Regression Testing?",
        answer: "Ensuring changes don’t break existing functionality.",
        tag: "Testing",
        category: "FIRST",
      },
      {
        question: "What is Test Coverage?",
        answer: "A metric showing how much code is tested.",
        tag: "Testing",
        category: "FIRST",
      },

      // tag : DEVOPS
      {
        question: "What is CI/CD?",
        answer: "Continuous Integration and Continuous Deployment.",
        tag: "DevOps",
        category: "FIRST",
      },
      {
        question: "What is Infrastructure as Code?",
        answer:
          "Managing infrastructure using code (e.g., Terraform, Ansible).",
        tag: "DevOps",
        category: "FIRST",
      },
      {
        question: "What is Docker?",
        answer: "A tool for containerizing applications.",
        tag: "DevOps",
        category: "FIRST",
      },
      {
        question: "What is Kubernetes?",
        answer: "An orchestration tool for managing containers.",
        tag: "DevOps",
        category: "FIRST",
      },
      {
        question: "What is a DevOps Pipeline?",
        answer: "A sequence of steps to automate software deployment.",
        tag: "DevOps",
        category: "FIRST",
      },
    ];

    await CardModel.insertMany(cards);

    process.exit();
  } catch (error) {
    console.error("Error seeding cards:", error);
    process.exit(1);
  }
};

seedCards();
