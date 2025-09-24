# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

You’re building Nandi, an AI-powered SDK that lets mobile game studios automatically optimize in-game store prices and quantities without doing any of the heavy lifting themselves. For the MVP, it focuses on consumables and soft-currency items in JavaScript-based mobile games. A developer simply defines each item once with basic details—name, icon, purpose, and price/quantity tolerance—and Nandi does the rest. Your backend generates every SKU variant needed for price and quantity testing and uses the official Apple and Google APIs to create those products directly in the App Store and Play Console, so the studio never has to touch their dashboards. The SDK integrates with the game’s analytics to track views, purchases, and conversion rates, then uses bandit algorithms to automatically route traffic toward the most promising variants.

Behind the scenes, Nandi links the game client, the app-store billing systems, and a cloud decision engine. The drop-in SDK resolves which SKU to display in real time, logs user events, and calls your backend for updated decisions. Your backend verifies purchases through Apple and Google, aggregates performance metrics, runs the bandit logic, and updates store configurations automatically. This creates a fully automated loop where developers only define the item parameters once, while Nandi continuously experiments, analyzes, and implements the winning price or quantity combinations to maximize revenue and conversion.

## Development Philosophy
We are building a bare bones MVP. Follow KISS (Keep it simple, stupid) and YAGNI (You aren’t gonna need it) principles.

This is a Next.js 15.5.2 project using the App Router architecture with TypeScript and Tailwind CSS v4. The project appears to be a landing page for "Nandi" and uses pnpm as the package manager.

## Development Commands

- `npm run dev` or `pnpm dev` - Start development server on localhost:3000
- `npm run build` or `pnpm build` - Build for production
- `npm start` or `pnpm start` - Start production server

## Architecture

The project follows Next.js App Router conventions:

- `src/app/` - App Router pages and layouts
- `src/app/layout.tsx` - Root layout with Geist font configuration
- `src/app/page.tsx` - Homepage component
- `src/app/globals.css` - Global styles with Tailwind CSS
- `public/` - Static assets (images, icons)

## Key Technologies

- **Next.js 15.5.2** with App Router
- **React 19.1.0** 
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** with PostCSS integration

## TypeScript Configuration

- Path mapping configured: `@/*` maps to `./src/*`
- Strict TypeScript settings enabled
- Target: ES2017

## Styling

- Uses Tailwind CSS v4 with the new PostCSS plugin approach
- Dark mode support via Tailwind CSS classes