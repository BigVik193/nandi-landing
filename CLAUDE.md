# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nandi is a B2B platform that empowers indie game developers and studios to deploy dynamic in-game stores for mobile games. The platform leverages AI to continuously optimize bundles, pricing, and layouts while enabling external payment processing to bypass Apple/Google commissions.

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