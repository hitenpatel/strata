import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('strata-switch')
export class StrataSwitch extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() label = '';

  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    :host([hidden]) {
      display: none;
    }
    button {
      display: inline-flex;
      align-items: center;
      gap: var(--strata-space-2, 8px);
      min-height: 40px;
      padding: 0;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: 14px;
      color: var(--strata-text, #0f172a);
      cursor: pointer;
      user-select: none;
    }
    button:focus-visible {
      outline: none;
    }
    button:focus-visible .track {
      box-shadow:
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    button:disabled {
      cursor: not-allowed;
      color: var(--strata-text-subtle, #94a3b8);
    }
    .track {
      display: inline-flex;
      align-items: center;
      width: 40px;
      height: 24px;
      flex: none;
      border-radius: var(--strata-radius-full, 999px);
      background: var(--strata-border-strong, #cbd5e1);
      padding: 2px;
      box-sizing: border-box;
      transition: background-color var(--strata-duration-base, 200ms)
        var(--strata-easing-default, ease);
    }
    .thumb {
      width: 20px;
      height: 20px;
      border-radius: var(--strata-radius-full, 999px);
      background: var(--strata-surface, #fff);
      box-shadow: var(--strata-shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.1));
      transform: translateX(0);
      transition: transform var(--strata-duration-base, 200ms) var(--strata-easing-default, ease);
    }
    :host([checked]) .track {
      background: var(--strata-accent, #2563eb);
    }
    :host([checked]) .thumb {
      transform: translateX(16px);
    }
    :host([disabled]) .track {
      background: var(--strata-border, #e2e8f0);
      opacity: 0.55;
    }
    :host([disabled]) .thumb {
      box-shadow: var(--strata-shadow-xs, 0 1px 1px rgba(0, 0, 0, 0.06));
    }
    @media (prefers-reduced-motion: reduce) {
      .track {
        transition: background-color var(--strata-duration-base, 200ms)
          var(--strata-easing-default, ease);
      }
      .thumb {
        transition: none;
      }
    }
  `;

  private toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <button
        type="button"
        role="switch"
        aria-checked=${this.checked ? 'true' : 'false'}
        aria-label=${this.label || nothing}
        ?disabled=${this.disabled}
        @click=${this.toggle}
      >
        <span class="track" aria-hidden="true"><span class="thumb"></span></span>
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-switch': StrataSwitch;
  }
}
