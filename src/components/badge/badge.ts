import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

@customElement('strata-badge')
export class StrataBadge extends LitElement {
  @property({ reflect: true }) tone: BadgeTone = 'neutral';

  static styles = css`
    :host {
      display: inline-flex;
      /* Sediment: badges are paint, not layers — flat tinted chip, no shadow.
         Private props overridden per tone below. */
      --_bg: var(--strata-surface-sunken, #f3efe9);
      --_edge: var(--strata-border-strong, #d6cec1);
      --_fg: var(--strata-text-muted, #6a6153);
    }
    :host([hidden]) {
      display: none;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: var(--strata-radius-full, 999px);
      background: var(--_bg);
      border: 1px solid var(--_edge);
      color: var(--_fg);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      line-height: 1.4;
      white-space: nowrap;
      box-shadow: none;
    }

    :host([tone='accent']) {
      --_bg: var(--strata-accent-subtle, #eef4ff);
      --_edge: var(--strata-accent, #2563eb);
      --_fg: var(--strata-accent, #2563eb);
    }
    :host([tone='success']) {
      --_bg: var(--strata-success-subtle, #eefaf1);
      --_edge: var(--strata-success, #16a34a);
      /* Mixed towards text to reach WCAG AA (4.5:1) at 11px — pure success
         green on its subtle tint measures ~3.2:1. Hue is preserved. */
      --_fg: color-mix(
        in srgb,
        var(--strata-success, #16a34a) 60%,
        var(--strata-text, #231f1a)
      );
    }
    :host([tone='warning']) {
      --_bg: var(--strata-warning-subtle, #fdf6e9);
      --_edge: var(--strata-warning, #d97706);
      /* Same AA adjustment — pure warning amber on its tint is ~2.4:1. */
      --_fg: color-mix(
        in srgb,
        var(--strata-warning, #d97706) 60%,
        var(--strata-text, #231f1a)
      );
    }
    :host([tone='danger']) {
      --_bg: var(--strata-danger-subtle, #fdf0ee);
      --_edge: var(--strata-danger, #dc2626);
      /* Slight mix towards text: pure danger red measures 4.41:1, a whisker
         under the 4.5:1 AA threshold at 11px. */
      --_fg: color-mix(
        in srgb,
        var(--strata-danger, #dc2626) 80%,
        var(--strata-text, #231f1a)
      );
    }
  `;

  render() {
    return html`<span class="badge"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-badge': StrataBadge;
  }
}
