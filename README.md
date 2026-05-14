# Quintet

A modern, browser-based multiplayer card-placement game. Place chips on a 10×10 board using playing cards from your hand. First to form the required number of five-in-a-row sequences wins.

**Live:** 2–4 players · No account needed · Share-by-link rooms · Real-time via Ably

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Global CSS — custom design system, CSS variables, no Tailwind |
| Fonts | Fraunces (headings) + Inter (body) + JetBrains Mono (IDs) |
| Real-time | [Ably](https://ably.com) — pub/sub channels for game events and lobby discovery |
| State | Zustand |
| Package manager | npm |

---

## Project Structure

```
app/                        # Next.js App Router pages
  layout.tsx                # Root layout: fonts, global CSS, PageTransition wrapper
  page.tsx                  # / — Home: hero, features, explainer
  how-to-play/page.tsx      # /how-to-play — step-by-step guide
  rules/page.tsx            # /rules — official rules
  play/page.tsx             # /play — Create / Join hub
  create-room/page.tsx      # /create-room — room creation form
  join-room/page.tsx        # /join-room — join by ID or live room list
  room/[id]/page.tsx        # /room/[id] — waiting lobby → live game
  api/
    ably-token/route.ts     # Serverless route: issues Ably token (keeps API key server-side)

components/
  ui/                       # Presentational atoms — props in, events out, no store imports
    Button.tsx              # .btn variants (primary, ghost, secondary, pill, block)
    PlayingCard.tsx         # Playing card face with rank + suit, selected/dead states
    Chip.tsx                # Chip circle with color gradient and locked ring
    BoardCell.tsx           # Board cell: card + chip layer + legal/last/in-seq states
    FreeDisk.tsx            # Golden FREE corner disk
    FormField.tsx           # Label + input wrapper
    SegmentedControl.tsx    # Two-option toggle (game mode selector)
    NumberBar.tsx           # Player count selector (2 / 3 / 4)
    ErrorMessage.tsx        # Danger-colored inline alert
    RoomRow.tsx             # Room entry in lobby list
    PlayerBadge.tsx         # Player row: chip dot + name + sequences + turn indicator
    HandSlot.tsx            # Card slot in player hand with dead-card flag
    LogRow.tsx              # Colored game log line
    Modal.tsx               # Backdrop + centered modal container
    TabBar.tsx              # Tab button group (used in RulesModal)
    Panel.tsx               # Paper-colored content card
    KV.tsx                  # Key-value pair display
    FeatureCard.tsx         # Feature icon + label + subtitle
    DotIndicator.tsx        # Online / status dot
  Navbar.tsx                # Marketing nav: brand + How to Play / Rules / Play
  RoomTopbar.tsx            # Game nav: brand + Share / Rules / Exit
  Footer.tsx                # Site footer with links
  HeroBoard.tsx             # Interactive 3D mini-board on homepage (mouse tilt + levitation)
  MiniBoard.tsx             # Static 5×5 mini-board for Play Hub card
  GameBoard.tsx             # Full 10×10 game board
  PlayersSidebar.tsx        # Players panel + hand + game log sidebar
  WaitingLobby.tsx          # Pre-game waiting room card
  RulesModal.tsx            # In-game rules modal with tabs
  WinModal.tsx              # Win screen overlay
  PageTransition.tsx        # Route-change fade + slide animation wrapper

hooks/
  useAblyRoom.ts            # Ably channel subscribe/publish for a room
  useGameState.ts           # Game state + move dispatch (host vs guest logic)
  usePlayerName.ts          # Persists player name in localStorage
  useCopyToClipboard.ts     # Copy text + 1.5s "Copied" feedback state

lib/
  game/
    constants.ts            # BOARD_SIZE, HAND_SIZE, SEQUENCES_TO_WIN, CHIP_GRADIENT, BOARD_SEED
    board.ts                # buildBoardLayout() — seeded 10×10 grid (deterministic, no server needed)
    deck.ts                 # buildDrawDeck() — 104-card shuffled deck
    moves.ts                # legalMoves(), isTwoEyedJack(), isOneEyedJack()
    sequences.ts            # detectSequences() — 5-in-a-row in 4 directions
    engine.ts               # newGameState(), applyMove(), discardDead(), isDeadCard()
  ably.ts                   # getAblyClient() singleton + channel name helpers

types/
  game.ts                   # All shared TypeScript types

styles/
  globals.css               # Full design system: CSS vars, all component classes, animations
```

---

## Architecture

### Host-driven multiplayer (no backend)
One player in each room acts as the **host** (the room creator). The host:
- Receives `game:move` / `game:discard` events from guests via Ably
- Validates the move against the game engine
- Broadcasts the authoritative `game:state` to all players

Guests never write game state directly — they only publish move intents and apply the state they receive from the host. This keeps logic consistent without a dedicated server.

### Channel structure
| Channel | Purpose |
|---|---|
| `room:{roomId}` | All game events for a room (moves, state, join/leave) |
| `rooms:lobby` | Room discovery — host pings every 30 s with room metadata |

### Game events on `room:{roomId}`
| Event | Publisher | Payload |
|---|---|---|
| `player:joined` | any | `{ name }` |
| `player:left` | any | `{ name }` |
| `game:started` | host | full `GameState` |
| `game:move` | guest → host | `{ playerIdx, cardIdx, r, c }` |
| `game:discard` | guest → host | `{ playerIdx, cardIdx }` |
| `game:state` | host → all | full `GameState` (after each mutation) |

### Game logic (pure functions, `lib/game/`)
All game logic is implemented as pure TypeScript functions with no side effects — easy to unit test and reuse anywhere. The board layout uses a seeded shuffle so every client builds an identical 10×10 grid without coordination.

### Persistence
Room records are stored in `localStorage` (`seq:room:{id}`). Player name is stored at `seq:name`. There is no server-side database.

---

## Design System

Design tokens live in `:root` in `styles/globals.css`:

```css
--felt-1: #0c2a1c   /* dark felt background */
--felt-2: #114a30
--felt-3: #1a6442
--paper:  #f2efe6   /* card / form surfaces */
--accent: #e2b340   /* gold — CTAs, highlights */
--primary:#2f8a4f   /* green — primary button */
--danger: #c8403d   /* red — errors, one-eyed jack */
```

Fonts: **Fraunces** (headings/brand) · **Inter** (body) · **JetBrains Mono** (room IDs/code)

Animations defined: `pulseLegal`, `chipDrop`, `heroFloat`, `logPulse`, `pageEnter`, `pulse` (via `--animate-pulse`).

---

## Getting Started

### Prerequisites
- Node.js 18+
- An [Ably](https://ably.com) account and API key (free tier is sufficient)

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your Ably key:
# ABLY_API_KEY=your.key:here

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `ABLY_API_KEY` | Yes | Server-side only. Used to issue restricted Ably tokens via `/api/ably-token`. Never exposed to the client. |

---

## Game Rules (summary)

- Players hold 7 cards each (6 in 4-player games)
- On your turn: play a card → place a chip on the matching board space → draw a new card
- **Two-eyed Jacks (J♦ J♣):** wild — place a chip anywhere
- **One-eyed Jacks (J♥ J♠):** anti-wild — remove an opponent's chip (not from completed sequences)
- **Dead cards:** if both spaces for your card are occupied, discard it for a free redraw
- **Corners** are free wild spaces for all players
- **Win:** 2 sequences for 2-player games; 1 sequence for 3- and 4-player games

---

## Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```
