# Nandi Landing Page Styling Guide

## Overview

This styling guide documents the comprehensive design system used in the Nandi landing page - a Next.js 15.5.2 application built for mobile games e-commerce optimization. The project uses Tailwind CSS v4 with a custom design system focused on modern typography, clean layouts, and conversion-optimized UI patterns.

## Typography System

### Font Families

The project uses two primary Google Fonts:

- **Bricolage Grotesque** (`--font-bricolage-grotesque`): Used for headings and titles
- **Figtree** (`--font-figtree`): Used for body text and general content

```css
/* CSS Variables */
--font-sans: var(--font-figtree);
--font-title: var(--font-bricolage-grotesque);
```

### Typography Hierarchy

**Display Headlines (H1)**
- Classes: `text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium font-title`
- Usage: Hero section main headlines
- Example: "Your always-on e-commerce growth engine"

**Section Headlines (H2)**
- Classes: `text-5xl lg:text-6xl font-medium font-title`
- Usage: Major section headings
- Example: "Always learning, always optimizing"

**Large Headlines (H2 Variant)**
- Classes: `text-6xl lg:text-7xl font-medium font-title`
- Usage: Pricing section headers
- Example: "Flexible pricing for every stage"

**Subsection Headers (H3)**
- Classes: `text-4xl font-bold`
- Usage: Pricing card titles, feature names

**Body Text**
- Classes: `text-lg text-gray-700` or `text-xl text-gray-700`
- Font: Figtree
- Usage: Paragraphs, descriptions

**Navigation Links**
- Classes: `text-lg text-gray-700 hover:text-black`
- Font: Figtree

## Color Palette

### Custom CSS Variables

```css
:root {
  --color-hero: #e6d1fc;      /* Light purple background */
  --color-section: #f7f7eb;   /* Light cream background */
  --color-pricing: #eeeedd;   /* Light beige background */
  --color-card: #f7f7eb;      /* Card background */
  --background: #ffffff;      /* Main background */
  --foreground: #171717;      /* Main text color */
}
```

### Background Colors

**Hero Section**
- Class: `bg-hero`
- Color: Light purple (`#e6d1fc`)
- Usage: Navigation bar, hero section

**Content Sections**
- Class: `bg-section`
- Color: Light cream (`#f7f7eb`)
- Usage: WhatIsNandi, LearnSection, PersonalizeSection, Competitive sections

**Pricing Section**
- Class: `bg-pricing`
- Color: Light beige (`#eeeedd`)
- Usage: StatsSection, Subscription section

**Cards**
- Class: `bg-card`
- Color: Light cream (`#f7f7eb`)
- Usage: Pricing cards, feature cards

### Text Colors

**Primary Text**
- Classes: `text-black`
- Usage: Headlines, important text

**Secondary Text**
- Classes: `text-gray-700`
- Usage: Body text, descriptions

**Muted Text**
- Classes: `text-gray-600`, `text-gray-400`
- Usage: Captions, metadata

**Accent Colors**
- Purple accent: `text-[#8b5cf6]` (used for highlighting key phrases)
- Discord brand: `bg-[#5865F2]`

## Component Patterns

### Container System

**Page Container**
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-8">
```

**Section Container**
```tsx
<section className="bg-section py-20">
  <div className="max-w-7xl mx-auto px-8">
```

### Grid Layouts

**Two-Column Layout (Hero, Learn Section)**
```tsx
<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
```

**Three-Column Layout (Pricing)**
```tsx
<div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
```

### Button Styles

**Primary CTA Button**
```tsx
className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors ring-4 ring-orange-300 ring-offset-2"
```

**Secondary Button**
```tsx
className="border-2 border-black text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-black hover:text-white transition-colors"
```

**Discord Button**
```tsx
className="bg-[#5865F2] text-white px-6 py-3 rounded-full font-medium text-lg hover:bg-[#4752C4] transition-colors"
```

**Pricing CTA Button**
```tsx
className="bg-purple-300 hover:bg-purple-400 text-black font-medium py-4 px-6 rounded-full text-lg transition-colors"
```

### Card Styling

**Pricing Cards**
```tsx
className="bg-card rounded-3xl p-8 shadow-lg flex flex-col relative"
```

**Feature Cards**
```tsx
className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 shadow-lg"
```

### Image Styling

**Hero Images**
```tsx
className="w-full max-w-[280px] sm:max-w-[440px] h-auto object-contain"
```

**Section Images**
```tsx
className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg"
```

**Persona Images**
```tsx
className="w-full h-full object-cover"
```

## Navigation Design

### Desktop Navigation
- Fixed positioning: `fixed top-0 left-0 right-0 z-50`
- Background: `bg-hero`
- Centered menu with absolute positioning
- Logo with custom diamond icon

### Mobile Navigation
- Hamburger menu with animated lines
- Dropdown overlay with `bg-white` background
- Full-width mobile buttons

## Animation Patterns

### Hover Effects
```css
transition-colors
hover:bg-gray-800
hover:text-black
hover:opacity-80
```

### Mobile Menu Animation
```tsx
className={`transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
```

### Counter Animations
- Uses `IntersectionObserver` for scroll-triggered animations
- Custom easing function: `easeOutQuart`
- Animated counting for statistics section

## Responsive Design

### Breakpoint Strategy
- Mobile-first approach
- Key breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Responsive typography scaling
- Grid layout transformations

### Typography Scaling
```tsx
// Example: Hero headline
text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
```

### Spacing System
- Section padding: `py-20` (consistent across sections)
- Container padding: `px-4 sm:px-8` (responsive)
- Grid gaps: `gap-8 lg:gap-12` (responsive)

## Icon System

### Custom Logo Icon
- Diamond shape created with CSS transforms
- Black background with white rotated square
- Consistent across navigation and footer

### React Icons
- Uses `react-icons/hi2` for sparkles: `HiSparkles`
- SVG icons for checkmarks and UI elements

## Accessibility Considerations

### Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- Semantic section tags
- Navigation landmarks

### Interactive Elements
- Focus states on buttons and links
- Proper ARIA labels for mobile menu
- Color contrast compliance

### Typography
- Sufficient font sizes for readability
- Line height optimization: `leading-tight`, `leading-relaxed`

## Performance Optimizations

### Font Loading
- Uses Next.js font optimization
- CSS variables for font families
- Subsets specified for Google Fonts

### Image Optimization
- Next.js Image component usage
- Responsive image sizing
- Aspect ratio preservation

## Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

## CSS Architecture

### Tailwind CSS v4 Configuration
- Uses new PostCSS plugin approach
- Inline theme configuration in CSS
- Custom CSS variables integration

### Global Styles
- Smooth scrolling: `scroll-behavior: smooth`
- Font family inheritance
- CSS custom properties

This styling guide serves as the foundation for maintaining design consistency across the Nandi landing page and can be extended for future development work.