# Strata

A themeable, accessible design system built layer by layer — two-tier design tokens and Lit 3 web components, documented in Storybook.

**Live Storybook:** https://ui.hiten.dev

## Architecture

- **Tokens** — a single [W3C Design Tokens](https://design-tokens.github.io/community-group/format/) source of truth at `tokens/tokens.json`, split into two tiers:
  - *Primitives*: raw scales (colour ramps, spacing, radii, shadows, motion).
  - *Semantic*: role-based aliases (`surface`, `text-muted`, `accent`, `danger-subtle`…) defined per theme.
- **Themes** — light (default) and dark via `<html data-theme="dark">`. Every semantic token is re-mapped; components never reference primitives directly.
- **Variants** — an alternate accent (`<html data-variant="showcase">`, violet) layered on top of either theme, demonstrating brand theming without touching component code.
- **Components** — Lit 3 web components consuming only `--strata-*` semantic custom properties, so they respond to theme/variant switches for free.

`pnpm tokens` compiles `tokens.json` → `src/generated/tokens.css` (custom properties on `:root` / `[data-theme]` / `[data-variant]`) and `tokens.ts` (typed JS exports).

## Accessibility

- WCAG 2.2 AA contrast in both themes
- Designed `:focus-visible` states — two-layer ring (2px surface, 4px focus colour)
- 40px minimum interactive targets
- `prefers-reduced-motion` honoured (transitions and spinners degrade gracefully)
- Loading states use `aria-busy`; every component ships axe-checked tests via `@open-wc/testing`

## Usage

```bash
npm install @hitenpatel/strata
```

```js
import '@hitenpatel/strata';          // registers all elements
import '@hitenpatel/strata/tokens.css'; // design token custom properties
```

```html
<strata-button variant="primary">Save changes</strata-button>
<strata-button variant="danger" loading>Deleting…</strata-button>
```

## Development

```bash
pnpm install
pnpm tokens       # build tokens.css + tokens.ts from tokens/tokens.json
pnpm storybook    # Storybook dev server on :6006
pnpm test         # @web/test-runner (Chromium via Playwright)
pnpm build        # tokens + tsc + dist/tokens.css
```

## License

MIT © [Hiten Patel](https://hiten.dev)
