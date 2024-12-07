# Next.js Auth Todo App

A modern web application built with Next.js 14, featuring authentication and todo list management.

## Features

- 🔐 User authentication
- ✅ Todo list management

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18.17 or higher)
- npm
- backend: You need to have a backend server running.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/thylakoids/just-next.git
cd just-next
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) with your browser to see the application.

## Project Structure

```
app/
├── components/         # Reusable UI components
├── context/           # React context providers
├── fonts/             # Custom font files
├── login/             # Login page and authentication
├── todo/              # Todo list feature
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and helpers
├── globals.css        # Global styles
├── layout.tsx         # Root layout component
├── page.tsx           # Home page component
public/               # Static assets
```