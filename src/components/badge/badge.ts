import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

@customElement('strata-badge')
export class StrataBadge extends LitElement {
  @property({ reflect: true }) tone: BadgeTone = 'neutral';

  static styles = css`
    :host {
      display: inline-flex;
      /* Quiet flat chip — tone-subtle background, tone-strong text.
         Private props overridden per tone below. */
      --_bg: var(--strata-surface-sunken, #f4f4f5);
      --_fg: var(--strata-text, #09090b);
    }
    :host([hidden]) {
      display: none;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 10px;
      border-radius: var(--strata-radius-full, 999px);
      background: var(--_bg);
      border: var(--strata-border-width, 1px) solid transparent;
      color: var(--_fg);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 12px;
      font-weight: 600;
      line-height: 1.4;
      white-space: nowrap;
    }

    :host([tone='accent']) {
      --_bg: var(--strata-accent-subtle, #eff6ff);
      --_fg: var(--strata-accent, #2563eb);
    }
    :host([tone='success']) {
      --_bg: var(--strata-success-subtle, #f0fdf4);
      /* Mixed towards text to reach WCAG AA (4.5:1) at 12px — pure success
         green on its subtle tint measures ~3:1. Hue is preserved. */
      --_fg: color-mix(
        in srgb,
        var(--strata-success, #16a34a) 60%,
        var(--strata-text, #09090b)
      );
    }
    :host([tone='warning']) {
      --_bg: var(--strata-warning-subtle, #fffbeb);
      /* Same AA adjustment — pure warning amber on its tint is ~2.4:1. */
      --_fg: color-mix(
        in srgb,
        var(--strata-warning, #d97706) 60%,
        var(--strata-text, #09090b)
      );
    }
    :host([tone='danger']) {
      --_bg: var(--strata-danger-subtle, #fef2f2);
      /* Slight mix towards text: pure danger red measures a whisker under
         the 4.5:1 AA threshold at this size. */
      --_fg: color-mix(
        in srgb,
        var(--strata-danger, #dc2626) 80%,
        var(--strata-text, #09090b)
      );
    }
  `;

  render() {
    return html`<span class="badge" part="badge"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-badge': StrataBadge;
  }
}
