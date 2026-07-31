# Prophetic Journal

**Hear. Record. Discern. Grow.**

A premium Christian prophetic journaling and training app for iPhone, iPad, and Android, built with Expo + React Native + TypeScript. Prophetic Journal is not just a journal — it's an interactive biblical training environment that helps Christians develop intimacy with God, practise hearing His voice, record what they sense, test it through Scripture, track confirmation, prayerfully reflect on dreams, and grow in maturity and discernment.

## Theological foundation

Hearing God grows out of **intimacy, rest, Scripture, prayer, worship, honesty, and relationship with the Holy Spirit** — never out of pressure, striving, fear, or a desire to appear spiritual. That conviction shapes the product itself:

- The app **never** claims AI speaks for God, and never says "God is telling you." AI here only organizes journal entries, notices recurring themes, surfaces related Scripture, and asks reflection questions — see `src/lib/reflectionAssistant.ts`.
- Every prophetic entry runs through a reusable **Biblical Discernment Checklist** (`src/components/shared/DiscernmentChecklist.tsx`).
- **High-caution topics** (marriage, health, finances, legal decisions, accusations, guaranteed predictions, etc.) trigger a warning before recording or sharing (`src/components/shared/HighCautionWarning.tsx`, `src/lib/highCaution.ts`).
- A **Sharing Prophetic Words** helper teaches humble language ("I had an impression that…") over controlling language ("God told me you must…").
- Prophetic accuracy is never gamified into a public leaderboard — Growth is a private record, not a scoreboard.

## Tech stack

- **Expo** (SDK 57) + **React Native** + **TypeScript**, targeting iOS, iPadOS, and Android from one codebase
- **React Navigation** (bottom tabs + native stack) for the 7 main sections: Home, Activations, Journal, Dreams, Discernment Map, Growth, Profile
- **Zustand**, persisted to `AsyncStorage`, as the local-first data layer — the app is fully usable offline
- **Supabase** (optional) for secure email/password accounts and cross-device cloud sync, gated behind `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`; see `supabase/schema.sql` for the row-level-secured schema
- `expo-local-authentication` for optional biometric app lock
- `expo-image-picker` / `expo-av` for photo and voice-note attachments on journal entries
- `react-native-svg` for the Discernment Map's node graph (a small on-device force-directed layout, see `src/lib/graphLayout.ts`) and the golden quill / open-book brand marks

## Getting started

```bash
npm install
npm run start   # then press i / a / w, or scan the QR code with Expo Go
```

Cloud sync is optional. Without `.env` configured, the app runs entirely offline on-device — nothing is lost, it just won't sync across devices:

```bash
cp .env.example .env
# fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
# then run supabase/schema.sql against that Supabase project
```

## Project structure

```
App.tsx                        Root providers (theme, safe area, gesture handler, navigation)
src/
  theme/                       Design tokens — navy/purple + gold/lavender palette, typography, ThemeProvider
  components/
    ui/                        Reusable primitives: Screen, Card, Button, Text, Badge, FormField, TagInput…
    shared/                    Domain components: DiscernmentChecklist, HighCautionWarning,
                                ShareLanguageHelper, Timer, PhotoPicker, VoiceRecorder, DateField
  navigation/                  Tab + stack navigators and typed navigation params
  screens/                     Home, Activations, Journal, Dreams, DiscernmentMap, Growth, Profile
  data/                        Seed content: 21 activations across all 16 categories, daily scriptures
  store/                       Zustand stores (journal, dreams, activation progress, discernment map, user)
  lib/                         Streaks, dates, reflection assistant, high-caution detection, graph layout,
                                growth analytics, Supabase client + sync, biometrics, data export
  types/                       Shared TypeScript data models
  constants/                   Taxonomy labels, disclaimers, discernment map node styling
supabase/schema.sql            Cloud schema with row-level security scoped to auth.uid()
```

## Feature tour

- **Home** — daily greeting, daily Scripture, continue/start an activation, quick journal + dream buttons, a daily listening prompt, recent entries, activation & journal streaks, unreviewed/awaiting-confirmation words, recurring themes, and a gentle "test everything" reminder.
- **Activations** — a beginner → developing → advanced pathway across all 16 requested categories (intimacy, quieting & listening, hearing through Scripture, inner impressions, prophetic pictures, identity, encouragement, words of knowledge, intercession, prophetic evangelism, dreams, symbolic language, discernment, testing & confirmation, sharing prophetic words, humility & maturity). Each activation has purpose, biblical foundation, preparation, step-by-step instructions, an optional timer, journal response fields, the discernment checklist, reflection questions, and related-activation recommendations.
- **Journal** — every field from the spec (type, question asked, what I sensed, how it came, Scripture, interpretation, emotional state, bias, confirmation, action, outcome, people/places/themes/tags, photos, voice notes, follow-up date, fulfillment status), plus scripture suggestions and automatic linking into the Discernment Map.
- **Dreams** — the full Biblical Dream Discernment field set, non-divinatory reflective questions ("What did this symbol mean to you personally?", "Could this be ordinary processing rather than spiritual communication?"), and the required disclaimer.
- **Discernment Map** — an interactive node graph across entries, dreams, Scriptures, symbols, people, themes, and more; tap a node to see its connections; manually link or unlink nodes; request AI-suggested connections that require explicit approval before they count.
- **Growth** — streaks, activation completion, most common ways you sense God, recurring themes, confirmation rate, a fulfilled-word tracker, lessons learned, a monthly reflection, and private milestones — never a public leaderboard.
- **Profile** — account & optional cloud sync, biometric lock, AI-processing consent, theme preference, data export, and delete-everything.

## Design system

Deep navy and midnight purple backgrounds, warm gold accents, soft lavender highlights, a subtle starfield, generous spacing, rounded cards, and gentle motion — with full light and dark themes (`src/theme/colors.ts`) tuned for accessible contrast.
