# Architecture Decisions — Spotify Mood Board

## Server / Client Boundary
- Server components:
  - Fetch data
  - Render static layout
- Client components:
  - Own interaction state
  - Handle mutations
  - Coordinate child components

## State Invariants
- `selected` ≠ `included`
- UI intent must never mutate backend truth directly
- Bulk actions only visible when selection exists

## Grid Contract
All table rows and headers must share:
grid-cols-[32px_40px_2fr_2fr_24px_56px]

## Backend Contract
PATCH /api/playlists/:id
Payload:
- trackId
- action: "add" | "remove"
