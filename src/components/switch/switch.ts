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
      color: var(--strata-text, #09090b);
      cursor: pointer;
      user-select: none;
    }
    button:focus-visible {
      outline: none;
    }
    button:focus-visible .track {
      outline: 2px solid var(--strata-focus-ring, #2563eb);
      outline-offset: 2px;
    }
    button:disabled {
      cursor: not-allowed;
      color: var(--strata-text-muted, #71717a);
    }
    .track {
      display: inline-flex;
      align-items: center;
      width: 40px;
      height: 24px;
      flex: none;
      border-radius: var(--strata-radius-full, 999px);
      background: var(--strata-border-strong, #d4d4d8);
      padding: 2px;
      box-sizing: border-box;
      transition: background-color var(--strata-duration-base, 200ms)
        var(--strata-easing-default, ease);
    }
    .thumb {
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      border-radius: var(--strata-radius-full, 999px);
      background: #fff;
      box-shadow: var(--strata-shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05));
      transform: translateX(0);
      transition: transform var(--strata-duration-base, 200ms)
        var(--strata-easing-default, ease);
    }
    :host([checked]) .track {
      background: var(--strata-accent, #2563eb);
    }
    :host([checked]) .thumb {
      transform: translateX(16px);
    }
    :host([disabled]) .track {
      opacity: 0.5;
    }
    @media (prefers-reduced-motion: reduce) {
      .track,
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
        <span class="track" part="track" aria-hidden="true"
          ><span class="thumb" part="thumb"></span
        ></span>
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
