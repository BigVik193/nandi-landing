# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

We are building a landing page for an AI-powered “always-on growth autopilot” for Shopify merchants who sell merch, apparel, and custom goods. Our target customers are independent creators, influencers selling branded merchandise, streetwear and lifestyle brands, and small custom gift shops—businesses that care about growing sales and maximizing conversions.

The product acts like a built-in growth and marketing team. It continuously tests and improves storefront elements—such as product images, banners, calls-to-action, and layouts—so stores are always optimized to convert. It integrates seamlessly with Shopify and GA4 to provide deep analytics and clear proof of growth.

The design language should be fun, colorful, and visually engaging—big product imagery (shirts, mugs, hoodies), bold storefront visuals that evolve in real time, and animations showing traffic and sales metrics rising. The aesthetic should match the friendly, polished look of Shopify apps: clean layouts, bright visuals, trust badges, and familiar archetypes of merchants (influencers, niche clothing brands, custom goods sellers).

The landing page should feel effortless and exciting, making growth feel automatic. Key sections include: a bold hero with imagery of a storefront dynamically improving; social proof with recognizable merchant types or logos; a demo animation showing the platform connecting to Shopify and driving sales; testimonials and case studies; and a clear pricing section with simple subscription tiers. The overall impression should be approachable, trustworthy, and focused on boosting revenue for small to mid-sized merchants.

This is a Next.js 15.5.2 project using the App Router architecture with TypeScript and Tailwind CSS v4. The project appears to be a landing page for "Tula" and uses pnpm as the package manager.

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