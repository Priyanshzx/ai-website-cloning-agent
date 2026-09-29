# 🎬 5-10 Minute Demo Video Walkthrough Guide

This document provides a minute-by-minute script and recording checklist for recording your demo video to score maximum points on all evaluation criteria.

---

## 📋 Recording Checklist

- [ ] Web browser open at `http://localhost:5173`
- [ ] Screen recorder active (OBS, Loom, QuickTime, or Windows Game Bar: `Win + Alt + R`)
- [ ] Microphone tested and clear

---

## ⏱️ Step-by-Step Demo Script (Target Time: 6–8 minutes)

### Minute 0:00 – 1:00 | Introduction & Architectural Overview
- **What to show**: The WebClone AI Studio home screen at `http://localhost:5173`.
- **What to say**:
  > *"Hello everyone! Today I'm demonstrating **WebClone AI**, an autonomous engineering agent that takes any public website URL, deconstructs its visual DNA, layout, typography, and color tokens, synthesizes clean modular React and Tailwind frontend components, and allows instantaneous natural-language modifications.
  > The system is built with a decoupled architecture: an Express/TypeScript analysis and validation backend paired with a high-performance React 18 studio frontend."*

---

### Minute 1:00 – 2:30 | Step 1 & 2: Entering URL & Live Agent Analysis
- **Action**:
  1. Click the **"Examples"** dropdown or type `https://linear.app`.
  2. Click **"Clone & Recreate"**.
- **What to show**:
  - Point to the **Agent Execution Pipeline** tab on the left.
  - Highlight the real-time progression:
    - *Step 1: URL Crawl & DOM Extraction*
    - *Step 2: Design Token & Layout Classification*
    - *Step 3: React TSX Component Synthesis*
    - *Step 4: AST Validation & Self-Healing Loop*
    - *Step 5: Sandbox Build & Live Hot-Reload*
  - Switch to the **Tokens & UI** tab to show:
    - Extracted dominant color palette (e.g., `#e2e4e7`, `#f79ce0`) with copyable hex values.
    - Typography hierarchy (headings, body fonts).
    - Identified semantic sections (`Navbar`, `Hero`, `Features`, `Stats`, `Pricing`, `Footer`).
- **What to say**:
  > *"When we click Clone, the agent crawls the website DOM, extracts stylesheets, analyzes computed color hierarchies, and breaks down the page into semantic section blueprints. Notice our AST self-healing engine catches any unclosed tags and ensures 100% compliant React 18 code."*

---

### Minute 2:30 – 4:00 | Step 3 & 4: Generated Website Preview & Codebase Explorer
- **Action**:
  1. Explore the interactive sandbox on the right panel.
  2. Click the **"Get Started"** button to show the interactive modal state!
  3. Click the **"Compare"** button on the top bar to show side-by-side split screen between the generated React app and the original website.
  4. Switch to the **Code Explorer** tab on the left.
- **What to show**:
  - Show the virtual file tree: `App.tsx`, `components/Navbar.tsx`, `components/Hero.tsx`, `components/Features.tsx`, `components/Pricing.tsx`, etc.
  - Click through components to demonstrate clean, modular code with reusable props.
- **What to say**:
  > *"Here is the live rendered React frontend. It is NOT an embedded iframe of the original site; it is a freshly synthesized React component tree using Tailwind CSS. Notice that interactive states like modal dialogs and navigation triggers work out of the box. In the Code Explorer, we can see the modular structure with separate files for Navbar, Hero, Features, Pricing, and Footer."*

---

### Minute 4:00 – 5:00 | Step 5: Responsive & Mobile Viewport Simulation
- **Action**:
  1. Click the **Tablet View** icon (`768px`) on the top bar. Show the grid collapsing cleanly into 2 columns.
  2. Click the **Mobile View** icon (`375px`) on the top bar. Show the realistic smartphone frame.
  3. Click the mobile **Hamburger Menu** icon (`☰`) to open the mobile drawer navigation.
  4. Click the **Desktop View** icon (`1440px`) to return to full screen.
- **What to say**:
  > *"Responsive design is a core requirement. With one click, we can simulate Tablet (768px) and Mobile (375px) viewports. Notice that on mobile, desktop navigation collapses cleanly into a slide-over mobile drawer, and multi-column grids fold into clean single-column cards."*

---

### Minute 5:00 – 7:30 | Step 6: Natural-Language Code Modifications
- **Action**:
  1. Click the **"AI Modifier"** tab on the left.
  2. Click the quick benchmark chip: **`"Replace the hero section with a bakery hero."`**
     - Watch the hero transform into an artisan bakery with sourdough photography, bakery badges, and cafe pickup CTAs!
  3. Click the quick benchmark chip: **`"Change the primary color to blue."`**
     - Watch the theme, buttons, and gradient glows shift to vibrant blue (`#2563EB`).
  4. Click the quick benchmark chip: **`"Make the navbar sticky."`**
     - Show the sticky fixed header behavior during scrolling.
  5. Click the quick benchmark chip: **`"Remove the pricing section."`**
     - Show the pricing table disappear from the page and navigation.
  6. Point out the **Modification History & Diffs** at the bottom of the tab.
- **What to say**:
  > *"Now let's test natural-language modifications. Here are the exact prompts from the assignment: First, 'Replace the hero section with a bakery hero' — the agent rewrites Hero.tsx with artisanal bakery copy and warm imagery. Next, 'Change primary color to blue' — instantly updates color tokens across all components. Next, 'Make navbar sticky' and 'Remove pricing section' — the agent unmounts the component and prunes navigation. Every change is logged with a diff summary in the history."*

---

### Minute 7:30 – 8:30 | Multi-Website Generalization & ZIP Export
- **Action**:
  1. Pick another website from the preset dropdown (e.g. **Stripe** or **Supabase**).
  2. Click **"Clone & Recreate"** to prove the agent works dynamically on unfamiliar websites.
  3. Click the **"Export ZIP"** button to download the complete standalone React repository.
- **What to say**:
  > *"To verify that our solution is not hardcoded for one website, we can clone Stripe or Supabase. The agent extracts distinct color palettes and sections for each site. Finally, clicking 'Export ZIP' packages the entire generated project into a standalone Vite + React project that can be downloaded and run independently anywhere. Thank you!"*
