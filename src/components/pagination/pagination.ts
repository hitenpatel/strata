import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('strata-pagination')
export class StrataPagination extends LitElement {
  /** Current page (1-based). */
  @property({ type: Number, reflect: true }) page = 1;
  /** Total number of pages. */
  @property({ type: Number, reflect: true }) total = 1;

  static styles = css`
    :host {
      display: block;
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    :host([hidden]) {
      display: none;
    }
    nav {
      display: flex;
      align-items: center;
      gap: var(--strata-space-1, 4px);
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 40px;
      padding: 0 var(--strata-space-2, 8px);
      border-radius: var(--strata-radius-md, 10px);
      border: 1px solid var(--strata-border-strong, #cbd5e1);
      background: var(--strata-surface, #fff);
      color: var(--strata-text, #0f172a);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition:
        background-color var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease),
        border-color var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease);
    }
    button:hover:not(:disabled):not([aria-current='page']) {
      background: var(--strata-surface-hover, #f8fafc);
    }
    button:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    button:disabled {
      opacity: 0.42;
      cursor: not-allowed;
    }
    button[aria-current='page'] {
      background: var(--strata-accent, #2563eb);
      border-color: transparent;
      color: var(--strata-on-accent, #fff);
      font-weight: 600;
    }
    .arrow {
      color: var(--strata-text-muted, #475569);
    }
    .ellipsis {
      min-width: var(--strata-space-6, 32px);
      text-align: center;
      color: var(--strata-text-subtle, #64748b);
      user-select: none;
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;

  /** Page numbers to display, with null marking a collapsed gap. */
  private get pageItems(): (number | null)[] {
    const total = Math.max(1, this.total);
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const visible: number[] = [];
    for (let p = 1; p <= total; p++) {
      if (p === 1 || p === total || Math.abs(p - this.page) <= 1) visible.push(p);
    }
    const items: (number | null)[] = [];
    let previous = 0;
    for (const p of visible) {
      if (p - previous === 2) {
        items.push(previous + 1); // a single hidden page — just show it
      } else if (p - previous > 2) {
        items.push(null);
      }
      items.push(p);
      previous = p;
    }
    return items;
  }

  private goTo(page: number): void {
    const clamped = Math.min(Math.max(page, 1), Math.max(1, this.total));
    if (clamped === this.page) return;
    this.page = clamped;
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: { page: clamped },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <nav aria-label="Pagination">
        <button
          class="arrow"
          aria-label="Previous page"
          ?disabled=${this.page <= 1}
          @click=${() => this.goTo(this.page - 1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        ${this.pageItems.map((item) =>
          item === null
            ? html`<span class="ellipsis" aria-hidden="true">…</span>`
            : html`
                <button
                  aria-current=${item === this.page ? 'page' : nothing}
                  aria-label=${`Page ${item}`}
                  @click=${() => this.goTo(item)}
                >
                  ${item}
                </button>
              `
        )}
        <button
          class="arrow"
          aria-label="Next page"
          ?disabled=${this.page >= this.total}
          @click=${() => this.goTo(this.page + 1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-pagination': StrataPagination;
  }
}
