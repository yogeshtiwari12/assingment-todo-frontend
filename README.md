# Assinment PS Frontend

A modern React + Vite todo dashboard with a polished UI, auth flow, and context-driven state management.

## Tech Stack

- React 19
- Vite
- Tailwind CSS 4
- Context API
- Fetch API

## Features

- Login and signup screens
- Cookie-based session handling through the backend
- Todo create, edit, delete, and refresh actions
- Status tracking with `pending`, `in progress`, and `completed`
- Search, filtering, and task stats
- Responsive dashboard layout

## Setup

1. Install dependencies:
	```bash
	npm install
	```
2. Start the dev server:
	```bash
	npm run dev
	```
3. If your backend runs on a different URL, set `VITE_API_URL` in a `.env` file.

## Scripts

- `npm run dev` - start the Vite dev server
- `npm run build` - build the app for production
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## Project Notes

- The app expects the backend API under `/api`.
- Make sure the backend is running before using the login and todo features.
