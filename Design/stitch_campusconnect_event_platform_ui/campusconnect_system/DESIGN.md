---
name: CampusConnect System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#474555'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#787586'
  outline-variant: '#c8c4d8'
  surface-tint: '#5543df'
  primary: '#5442de'
  on-primary: '#ffffff'
  primary-container: '#6d5ef8'
  on-primary-container: '#ffffff'
  inverse-primary: '#c5c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#a63628'
  on-tertiary: '#ffffff'
  tertiary-container: '#c74e3e'
  on-tertiary-container: '#fffeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c5c0ff'
  on-primary-fixed: '#140067'
  on-primary-fixed-variant: '#3c22c7'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#410000'
  on-tertiary-fixed-variant: '#872015'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.015em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.5rem
  space-sm: 1rem
  space-md: 1.5rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style

This design system targets modern university students seeking seamless event discovery, social engagement, and campus activity coordination. The aesthetic balances collegiate credibility with vibrant, contemporary consumer product conventions.

The visual direction centers on crisp, modular modernity:
- **Tone:** Energetic, approachable, organized, and focused.
- **Visual Style:** Modern clean modular layout, marked by generous white/light slate surfaces, controlled high-contrast typography, refined ambient elevation, and precise micro-borders.
- **Emotional Response:** Inspires clarity, anticipation, and effortless social connection while preventing cognitive fatigue across dense event feeds and ticketing workflows.

## Colors

The palette leverages an energetic, electric violet primary anchor paired with neutral slate surfaces to maintain clarity and legibility.

- **Primary Violet (`#6D5EF8`):** Main interactive driver, active tab indicators, primary actions, and focused states.
- **Secondary Emerald (`#10B981`):** Registration confirmation, free admission flags, positive states, and successful RSVPs.
- **Tertiary Coral (`#F97360`):** Alerts, limited seat warnings, sold-out tags, and critical cancellation actions.
- **Canvas & Surfaces:**
  - Base Background: `#F8FAFC` (Slate 50)
  - Card/Modal Surface: `#FFFFFF`
  - Subtle Surface Neutral: `#F1F5F9` (Slate 100)
  - Border Lines: `#E2E8F0` (Slate 200)
- **Typography:**
  - Primary Text: `#111827` (Dark Navy / Gray 900)
  - Secondary Text: `#475569` (Slate 600)
  - Muted/Placeholder: `#94A3B8` (Slate 400)

## Typography

The typographic pairing pairs `Plus Jakarta Sans` for titles and section landmarks with `Inter` for body copy, tabular lists, metadata, and form components. 

- **Display & Headlines:** Set in `Plus Jakarta Sans` to inject a warm, contemporary collegiate personality with geometric punch.
- **Body & Labels:** Set in `Inter` with optical line-heights calibrated for instant scannability across dense schedule calendars, ticket detail cards, and campus club feeds.
- **Hierarchy Rules:** High contrast is strictly maintained between `#111827` titles and `#475569` narrative copy; never use low-contrast text on colored badges.

## Layout & Spacing

The layout is grounded in a strict 8px harmonic scale: `space-xs` (8px), `space-sm` (16px), `space-md` (24px), `space-lg` (32px), and `space-xl` (48px).

- **Grid Architecture:**
  - **Desktop (≥ 1024px):** 12-column responsive fluid grid with 24px gutters, max-width bounded at 1280px, and outer margins of 32px.
  - **Tablet (768px – 1023px):** 8-column grid with 16px gutters and 24px margins.
  - **Mobile (< 768px):** 4-column single-column flow with 16px gutters and 16px margins (`margin-sm`).
- **Rhythm Rules:**
  - Internal card padding is consistently `16px` for compact event previews or `24px` for full-detail cards.
  - Horizontal grouping of tags, badges, and avatars strictly leverages `8px` (`space-xs`) gaps.

## Elevation & Depth

Visual hierarchy uses a refined hybrid approach: low-contrast borders combined with soft ambient drop shadows tinted with slate/navy.

- **Level 0 (Flat / Canvas):** Surface color `#F8FAFC`, no shadow, 0 border. Used for root canvas and secondary content wells.
- **Level 1 (Cards, Modules, Input Groups):** Background `#FFFFFF`, 1px structural border `#E2E8F0`, and ambient shadow: `0 1px 3px 0 rgba(17, 24, 39, 0.05), 0 1px 2px -1px rgba(17, 24, 39, 0.03)`.
- **Level 2 (Hover States, Action Menus, Dropdowns):** Background `#FFFFFF`, 1px border `#CBD5E1`, and shadow: `0 4px 6px -1px rgba(17, 24, 39, 0.07), 0 2px 4px -2px rgba(17, 24, 39, 0.05)`.
- **Level 3 (Modals, Registration Sheets, Dialogs):** Background `#FFFFFF`, 1px border `#CBD5E1`, and deep shadow: `0 20px 25px -5px rgba(17, 24, 39, 0.08), 0 8px 10px -6px rgba(17, 24, 39, 0.04)`.

## Shapes

The geometric framework balances crisp structure with comfortable touch targets:

- **Cards & Surface Containers:** Fixed at 12px radius (`rounded-lg`) for event tiles, modal sheets, and registration steps.
- **Interactive Controls & Badges:** Fixed at 8px radius (`rounded-md`) for primary buttons, form text fields, dropdown selectors, and small notification containers.
- **Pills, Avatars, and Tags:** Rounded-full (9999px) for category filters, status chips (e.g., "Happening Now", "Free Food"), club icons, and user profiles.

## Components

### Buttons
- **Primary:** Filled `#6D5EF8` background, `#FFFFFF` text, 8px border radius, 44px min-height (12px vertical, 20px horizontal padding). On hover: `#5A4BE2`. Active: 1px inner press effect.
- **Secondary:** `#FFFFFF` background, 1px border `#E2E8F0`, `#111827` text. On hover: `#F8FAFC` surface with `#CBD5E1` border.
- **Destructive:** Coral `#F97360` filled or outlined with soft red tint (`#FEF2F2`) on secondary contexts.

### Cards
- **Event Discovery Card:** 12px radius, `#FFFFFF` surface, 1px border `#E2E8F0`, Level 1 ambient shadow. 
- **Card Media:** Aspect ratio 16:9, cropped with upper 12px radius, incorporating an overlay pill badge at top-right for event categories.
- **Interactive Behavior:** On desktop hover, elevate smoothly from Level 1 to Level 2 with a 2px vertical transform (`translateY(-2px)`).

### Input Fields & Controls
- **Text Inputs:** Height 44px, 8px radius, `#FFFFFF` background, 1px border `#CBD5E1`, `#111827` text with `#94A3B8` placeholder. Focus ring: 2px solid `#6D5EF8` with 2px offset.
- **Checkboxes & Radios:** 18px square (checkbox: 4px radius) or circular (radio), `#E2E8F0` border. Active state: filled `#6D5EF8` with white checkmark/dot.

### Chips & Badges
- **Status Badges:** Fully rounded (9999px), 6px vertical and 12px horizontal padding.
  - *Success / RSVP'd:* Emerald surface tint (`#ECFDF5`), `#047857` text.
  - *Urgent / Limited Spots:* Coral surface tint (`#FFF1F0`), `#BE123C` text.
  - *Primary Filter Chips:* Slate tint (`#F1F5F9`), `#475569` text. When selected: `#6D5EF8` fill with `#FFFFFF` text.

### Campus-Specific Modules
- **Countdown Ticket Pill:** Miniature pill badge combining a monospace live time remaining alongside seat counts.
- **Attendee Facepile:** Stacked 32px circular avatars with a 2px `#FFFFFF` outline, terminating in a numeric counter pill (e.g., `+42`).