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
      color: var(--strata-text, #231f1a);
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
      color: var(--strata-text-subtle, #8c8271);
    }
    /* Sediment: recessed channel; the thumb is a mini slab that slides and settles */
    .track {
      display: inline-flex;
      align-items: center;
      width: 40px;
      height: 24px;
      flex: none;
      border-radius: var(--strata-radius-full, 999px);
      background: var(--strata-surface-sunken, #f3efe9);
      border: var(--strata-border-width, 1.5px) solid var(--strata-border-strong, #d6cec1);
      padding: 2px;
      box-sizing: border-box;
      transition:
        background-color var(--strata-duration-base, 200ms) var(--strata-easing-drop, ease),
        border-color var(--strata-duration-base, 200ms) var(--strata-easing-drop, ease);
    }
    .thumb {
      width: 18px;
      height: 18px;
      box-sizing: border-box;
      border-radius: var(--strata-radius-full, 999px);
      background: var(--strata-surface, #fff);
      border: var(--strata-border-width, 1.5px) solid var(--strata-border-strong, #d6cec1);
      box-shadow: 2px 2px 0 0 var(--strata-layer-shadow, #d6cec1);
      transform: translateX(0);
      transition:
        transform var(--strata-duration-base, 200ms)
          var(--strata-easing-settle, cubic-bezier(0.22, 1.2, 0.36, 1)),
        border-color var(--strata-duration-base, 200ms) var(--strata-easing-drop, ease),
        box-shadow var(--strata-duration-base, 200ms) var(--strata-easing-drop, ease);
    }
    :host([checked]) .track {
      background: var(--strata-accent, #2563eb);
      border-color: var(--strata-layer-shadow-accent, #1d4ed8);
    }
    :host([checked]) .thumb {
      transform: translateX(16px);
      border-color: var(--strata-layer-shadow-accent, #1d4ed8);
      box-shadow: 2px 2px 0 0 var(--strata-layer-shadow-accent, #1d4ed8);
    }
    :host([disabled]) .track {
      background: var(--strata-surface-sunken, #f3efe9);
      border-color: var(--strata-border, #e7e1d8);
      opacity: 0.55;
    }
    :host([disabled]) .thumb {
      border-color: var(--strata-border, #e7e1d8);
      box-shadow: none;
    }
    :host([disabled][checked]) .track {
      background: var(--strata-accent, #2563eb);
    }
    /* Reduced motion: position change is instant, colour still crossfades */
    @media (prefers-reduced-motion: reduce) {
      .thumb {
        transition:
          border-color var(--strata-duration-base, 200ms) var(--strata-easing-drop, ease),
          box-shadow var(--strata-duration-base, 200ms) var(--strata-easing-drop, ease);
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
