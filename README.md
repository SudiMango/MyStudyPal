# MyStudyPal

MyStudyPal is an AI-powered study platform that turns learning materials into useful study tools.  
Upload notes or textbooks, generate flashcards and quizzes, and track progress as you study.

Create a study set -> upload your documents -> create flashcards and quizzes!

## What it does

- Generates flashcards and quizzes from uploaded documents
- Supports topic-focused generation (not just whole-document output)
- Tracks study progress over time
- Includes secure auth (email/password + Google OAuth)

## Tech stack

**Frontend**

- Next.js
- React
- TypeScript
- Tailwind CSS

**Backend**

- Java 21
- Spring Boot
- Spring Security + JWT
- PostgreSQL
- Google GenAI (Gemini)
- Apache PDFBox

## A quick note on RAG

MyStudyPal uses **Retrieval-Augmented Generation (RAG)** to improve output quality and reduce token usage.

At a high level:

1. A PDF is uploaded and text is extracted.
2. The text is split into chunks with overlap to preserve context.
3. Chunks are embedded into vectors.
4. The most relevant chunks are retrieved for a given prompt.
5. Gemini generates flashcards/quizzes using only relevant context.

This helps reduce hallucinations and keeps generation grounded in the user’s material.

## Running locally

The `.env.example` files and `application-example.yaml` file shows how environment variables should be structured.

---

From the project root:

```bash
make dev
```

Or run services separately:

```bash
make be   # backend
make fe   # frontend
```

## Contributing

Contributions are welcome. Bug fixes, UX improvements, and new features are all appreciated.

If you want a place to start, here are good first ideas:

- Add support for user-provided API keys (so users can bring their own Gemini key)
- Add support for different AI providers to be used instead of just Gemini
- Extend the tracking and stats for quizzes and flashcards so that users can better see their improvement over time
- Be able to visually choose which question types you want in the quiz
- Be able to only view starred/unreviewed flashcards
- Be able to bulk generate flashcards and quiz questions using AI after a quiz/flashcard set has been created
- Improve generated quiz variety (difficulty levels, question types)
- Better optimization across the frontend and backend
- Improve accessibility, design, keyboard navigation, etc across the UI

If you open a PR, keep changes focused and include a short description of the problem and your approach.
