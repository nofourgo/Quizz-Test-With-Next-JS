# Sexcalibur Quiz System - Next.js Version

A modern, responsive quiz system built with Next.js, TypeScript, and Tailwind CSS. This application allows you to create, edit, view, and take quizzes using Excel files.

## Features

- **Question Editor**: Edit quiz questions with a modern drag-and-drop interface (drag-and-drop functionality to be implemented)
- **Quiz Viewer**: View quiz questions and answers from Excel files
- **Interactive Quiz**: Take quizzes with timer, navigation, and instant scoring
- **Responsive Design**: Works on desktop and mobile devices
- **Excel Integration**: Import and export quiz data using Excel files

## Getting Started

1. Install Node.js from [https://nodejs.org](https://nodejs.org)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app` - Next.js app router pages
  - `page.tsx` - Home page with navigation
  - `/editor` - Question editor
  - `/viewer` - Quiz viewer
  - `/quiz` - Interactive quiz taker

## Excel File Format

The Excel file should have the following columns:
- `question_content` - The question text
- `answer_1`, `answer_2`, `answer_3`, `answer_4` - The answer options
- `explanation_answer_1`, `explanation_answer_2`, `explanation_answer_3`, `explanation_answer_4` - Explanations for each answer
- `isCorrect` - The correct answer number (1-4)
- `difficulty` (optional) - Difficulty level

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- XLSX library for Excel file handling

## Migration from HTML Version

This Next.js version provides:
- Better UI/UX with modern design
- Responsive layout
- TypeScript for better code quality
- Component-based architecture
- Improved performance
- Easier maintenance and extensibility

The drag-and-drop functionality from the original editor is planned for future implementation.