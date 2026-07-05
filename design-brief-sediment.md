# Strata Redesign Brief — "Sediment"

## What this is

A full visual redesign of Strata's 21 components. The current rendering is generic (Bootstrap-adjacent flat fills). This brief replaces the visual language entirely. **Not changing**: component set, APIs/props, the two-tier token architecture, fonts, control heights (40px inputs/buttons), or the light/dark/showcase theme structure.

## The concept

**Strata = layers of sediment. The UI is made of physical layers.**

Every element is a slab of material resting on the strata beneath it. Nothing floats, nothing glows, nothing blurs — elevation is expressed by *visibly showing the layers*: solid offset shadows, echoed under-edges, and colour bands. Interaction is layers *moving*: pressing pushes a slab down onto its shadow; dialogs slide in and settle; the active tab is literally the top layer.

Reference feel: Gumroad's confidence, Notion's approachability — but softer, warmer, and systemised around the layer metaphor. Distinctive, friendly, never brutalist-harsh.

## The five rules of the visual language

1. **Solid offset shadows, never blur.** Elevation = a hard shadow offset down-right (2–6px by elevation level). Shadow colour is a *darker shade of the element's own material* (accent-700 under a primary button, a deep neutral under cards) — never plain black.
2. **Echoed under-edges.** High-elevation surfaces (cards, dialogs, menus) show 1–2 progressively inset "lower layer" edges peeking out beneath — the strata cross-section.
3. **Strata bands.** A 3px vertical band on the left edge carries tone/meaning: toast severity, active nav states, highlighted cards. Bands are the system's colour-coding device.
4. **Crisp solid borders.** 1.5px borders slightly darker than the fill, on all interactive slabs. Hairlines only for internal separators (table rows).
5. **Motion = settle.** Layers slide/drop into place with a short settle (tiny overshoot, then rest). The signature interaction: **press = the element translates down-right onto its shadow (shadow collapses to 0), release springs it back up.**

## Hard constraints

- Components consume only `--strata-*` semantic tokens; all new effects arrive as new tokens (proposals below).
- WCAG 2.2 AA: text ≥ 4.5:1, UI states ≥ 3:1, in **both** light and dark. Showcase variant only swaps accent blue→violet; everything else inherits.
- Every animation needs a `prefers-reduced-motion` fallback (opacity or none).
- Fonts fixed: Inter (body), Satoshi (display), JetBrains Mono (mono).

## Open design decisions (for the design tool)

1. **Dark theme shadows** — solid offsets under dark slabs: near-black offsets on a dark canvas barely read. Options: lighten the canvas a step, use border-visible offsets, or flip to a subtle lighter under-edge. Pick one and specify values.
2. **Neutral temperature** — current neutrals are cool slate. Warmer, paper/stone-leaning neutrals would suit the sediment metaphor; confirm a revised neutral ramp (11 steps, n-0 → n-950) or keep cool.
3. **Radius scale** — slabs probably want slightly tighter radii than the current 8px default (6px?), with radius-full kept for pills/avatars. Confirm the 5-step scale.
4. **Offset direction** — down-right everywhere is the default proposal; confirm (and confirm it flips or stays in RTL).

## Proposed new/changed tokens

| Token | Purpose | Starting point (light) |
|---|---|---|
| `offset-1 / offset-2 / offset-3` | Elevation offsets (button / card,menu / dialog) | 2px / 4px / 6px |
| `layer-shadow` | Solid shadow under neutral slabs | n-300 |
| `layer-shadow-accent` | Under primary/accent slabs | blue-700 (violet-700 in showcase) |
| `layer-shadow-danger` | Under danger slabs | red-700 |
| `layer-edge-1 / layer-edge-2` | Echoed under-edge colours (progressively fainter) | n-300 / n-200 |
| `band-accent / band-danger / band-success / band-warning / band-neutral` | Strata band colours | tone-600 values |
| `border-width` | Slab border | 1.5px |
| `easing-settle` | Slide-in with settle | cubic-bezier(.22,1.2,.36,1) |
| `easing-drop` | Press-down | cubic-bezier(.4,0,.6,1) |
| `duration-press` | Press/release | 90ms |
| Shadow tokens `shadow-xs…lg` | **Repurposed** to the solid-offset composites above | — |

## Per-component redesign

- **Button** — primary: accent slab, 1.5px accent-700 border, solid accent-700 shadow at offset-1; hover lifts +1px (shadow grows); press drops onto shadow. Secondary: surface slab, neutral shadow. Ghost: flat (no layer) until hover, when a faint slab appears under it. Danger mirrors primary in red. Loading: spinner replaces label, slab stays dropped (pressed position) while busy.
- **IconButton** — same slab system, square with radius-md.
- **Input / Textarea** — the *inverse* of a slab: a recessed bed. Border + a 1–2px solid inset top edge (the layer above casting onto it). Focus: border → accent + the strata band appears on the left edge (3px, accent). Error: band + border in danger.
- **Select** — recessed bed like Input; the dropdown panel is a floating slab (offset-2 + echoed edges). Chevron rotates on open.
- **Checkbox** — a small slab that *stamps down* when checked: unchecked = raised empty slab with offset-1 shadow; checked = dropped flat, filled accent, check mark stamps in with a scale 1.15→1 settle.
- **Radio** — same stamp language; inner dot drops in with settle.
- **Switch** — track is a recessed channel; thumb is a mini slab with its own offset-1 shadow that *slides along the channel and settles* with 1–2px overshoot. Checked track fills accent.
- **Badge** — flat colour chip with 1px tone-600 border, no shadow (badges are paint, not layers), tone-subtle fill, 11px/600/+0.04em type.
- **Card** — the flagship: surface slab, 1.5px border, offset-2 neutral shadow, **two echoed under-edges** peeking below. Optional `band` accent variant. Interactive cards lift on hover.
- **Avatar** — circular, 1.5px border; stacked avatars overlap like layered discs with 2px surface rings.
- **Skeleton** — layered loading: two stacked grey slabs where the top one slides horizontally (sediment shifting). Reduced-motion: opacity pulse.
- **Tooltip** — small dark slab (n-900 in light theme), offset-1 shadow, no echoes; enters with a 4px settle from the anchor side.
- **Toast** — slabs that **stack like sediment**: each toast shows its under-edges, new toasts slide in from the region edge and settle on top of the pile; 3px severity band on the left; dismiss = the layer slides out and the pile settles.
- **Dialog** — the deepest stack: panel with offset-3 shadow + two echoed edges; backdrop is a flat scrim (no blur); panel enters sliding up 12px with settle. Header uses Satoshi.
- **Tabs** — the concept's clearest expression: tablist sits on a lower stratum (sunken strip); the **active tab is a raised slab joined to the content panel** (shared surface, border merges); inactive tabs sit flat on the strip. Switching = the raised slab moves with a settle.
- **Menu** — floating slab (offset-2 + 1 echoed edge); items get full-width hover fill; active item gets the 3px band. Enters with 4px drop + settle.
- **Table** — header row is a *lower stratum* (sunken fill + overline type); body rows on surface; row hover = faint fill; numeric cells tabular-nums. Optional banded rows = alternating strata tints.
- **Breadcrumb** — flat text path; current page carries a small underline band (3px, accent, offset below like a mini stratum).
- **Pagination** — active page is a mini raised slab (primary button treatment, offset-1); neighbours flat; page change = the slab slides to the new number and settles.
- **Focus ring (all)** — the "double layer outline": 2px accent ring offset 2px from the element, *plus* the element's own border darkening — reads as a layer lifted for inspection.

## Deliverables wanted back

1. Decisions on the 4 open questions (dark-theme shadow strategy, neutral temperature, radius scale, offset direction).
2. Confirmed token table — every colour-bearing token in light + dark (+ showcase accent swaps).
3. Reference frames, light + dark, for the concept-defining seven: **Button (all states incl. pressed), Card (w/ echoes + band variant), Input (rest/focus/error), Switch, Tabs, Dialog, Toast stack**. The remaining components will be implemented from the system rules.
