import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

@customElement('strata-badge')
export class StrataBadge extends LitElement {
  @property({ reflect: true }) tone: BadgeTone = 'neutral';

  static styles = css`
    :host {
      display: inline-flex;
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
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 12px;
      font-weight: 600;
      line-height: 1.4;
      white-space: nowrap;
    }

    :host([tone='neutral']) .badge {
      background: var(--strata-surface-sunken, #f1f5f9);
      color: var(--strata-text-muted, #475569);
    }
    :host([tone='accent']) .badge {
      background: var(--strata-accent-subtle, #eff6ff);
      color: var(--strata-accent, #2563eb);
    }
    :host([tone='success']) .badge {
      background: var(--strata-success-subtle, #f0fdf4);
      /* Mixed towards text to reach WCAG AA (4.5:1) at 12px — pure success
         green on its subtle tint measures ~3.2:1. Hue is preserved. */
      color: color-mix(
        in srgb,
        var(--strata-success, #16a34a) 60%,
        var(--strata-text, #0f172a)
      );
    }
    :host([tone='warning']) .badge {
      background: var(--strata-warning-subtle, #fffbeb);
      /* Same AA adjustment — pure warning amber on its tint is ~2.4:1. */
      color: color-mix(
        in srgb,
        var(--strata-warning, #d97706) 60%,
        var(--strata-text, #0f172a)
      );
    }
    :host([tone='danger']) .badge {
      background: var(--strata-danger-subtle, #fef2f2);
      /* Slight mix towards text: pure danger red measures 4.41:1, a whisker
         under the 4.5:1 AA threshold at 12px. */
      color: color-mix(
        in srgb,
        var(--strata-danger, #dc2626) 80%,
        var(--strata-text, #0f172a)
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
