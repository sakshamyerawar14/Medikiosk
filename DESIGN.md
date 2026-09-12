# MediKiosk — Design System & UI/UX Specification

## 1. Design System Tokens (Verdana Health)

### 1.1 Color Palette
- **Primary Navy**: `#0F172A` (Primary actions, top headings, kiosk CTAs)
- **Secondary Slate**: `#64748B` (Subtext, auxiliary details, borders `#E2E8F0`)
- **Tertiary Sage / Healthcare Green**: `#059669` (Positive actions, healthcare accents, confirmation states)
- **Background**: `#F8FAFC` (Calm, clinical base)
- **Surface**: `#FFFFFF` (Card surfaces, modals)
- **Status Semantic Colors**:
  - **Success**: `#22C55E` / `#059669`
  - **Warning**: `#EAB308` / `#D97706`
  - **Error / Urgent Alert**: `#EF4444` / `#DC2626`
  - **Info**: `#0EA5E9` / `#0284C7`
  - **AI Indicator**: `#7C3AED` / `#F5F3FF`

### 1.2 Typography Hierarchy
- **Heading Font**: `Plus Jakarta Sans` (Display, H1, H2, H3, H4)
- **Body Font**: `DM Sans` (Body Large, Body, Body Small, Caption)
- **Monospace Font**: `Fira Code` (Lab values, medical measurements, tokens, IDs)

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| Display | 40px | 1.2 | Bold (700) | Kiosk Welcome Hero |
| H1 | 32px | 1.25 | Bold (700) | Primary Screen Titles |
| H2 | 24px | 1.3 | Semibold (600) | Section Headers |
| H3 | 20px | 1.4 | Semibold (600) | Card Headers |
| H4 | 16px | 1.5 | Medium (500) | Subsection Headers |
| Body Large | 18px | 1.6 | Regular (400) | Kiosk Touch Text |
| Body | 16px | 1.6 | Regular (400) | Standard Body |
| Body Small | 14px | 1.5 | Regular (400) | Auxiliary Notes |
| Caption | 12px | 1.4 | Medium (500) | Badges & Metadata |

### 1.3 Touch Targets & Border Radius
- Kiosk buttons use `min-height: 56px` with `border-radius: 12px` or `16px`.
- Regular desktop cards use `border-radius: 12px` or `8px`.
- Shadows are subtle: `0 1px 3px rgba(15, 23, 42, 0.03)` to `0 4px 16px rgba(15, 23, 42, 0.07)`.

---

## 2. Core Clinical & UX Principles

1. **AI Prepares, Doctor Decides**:
   - MediKiosk assists with intake and draft generation.
   - It never emits an autonomous diagnosis or treatment prescription.
   - All AI content is distinctly tagged with an AI badge and requires clinician verification.

2. **Multimodal Accessibility**:
   - Voice speech-to-text in regional languages (Hindi, Marathi, Tamil, English).
   - Touch-screen fallback for every question (large touch chips).
   - Audio prompt playback (Text-to-Speech) for low-literacy patients.

3. **Red-Flag Escalation**:
   - Detection of potential urgent symptoms (acute chest pain, respiratory distress, unbearable pain) triggers emergency hospital staff escalation.
