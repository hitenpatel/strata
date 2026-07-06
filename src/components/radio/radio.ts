import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('strata-radio')
export class StrataRadio extends LitElement {
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() name = '';
  @property() value = '';

  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    :host([hidden]) {
      display: none;
    }
    label {
      display: inline-flex;
      align-items: center;
      gap: var(--strata-space-2, 8px);
      min-height: 40px;
      font-size: 14px;
      color: var(--strata-text, #09090b);
      cursor: pointer;
      user-select: none;
    }
    :host([disabled]) label {
      cursor: not-allowed;
      color: var(--strata-text-muted, #71717a);
    }
    input {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: 0;
      opacity: 0;
      pointer-events: none;
    }
    .circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      flex: none;
      border-radius: var(--strata-radius-full, 999px);
      border: var(--strata-border-width, 1px) solid var(--strata-border-strong, #d4d4d8);
      background: var(--strata-surface, #fff);
      box-sizing: border-box;
      transition: border-color var(--strata-duration-fast, 150ms)
        var(--strata-easing-default, ease);
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: var(--strata-radius-full, 999px);
      background: var(--strata-accent, #2563eb);
      transform: scale(0);
      opacity: 0;
      transition:
        transform var(--strata-duration-fast, 150ms) var(--strata-easing-out, ease-out),
        opacity var(--strata-duration-fast, 150ms) var(--strata-easing-out, ease-out);
    }
    :host([checked]) .circle {
      border-color: var(--strata-accent, #2563eb);
    }
    :host([checked]) .dot {
      transform: scale(1);
      opacity: 1;
    }
    :host([disabled]) .circle {
      opacity: 0.5;
    }
    input:focus-visible + .circle {
      outline: 2px solid var(--strata-focus-ring, #2563eb);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      .circle,
      .dot {
        transition: none;
      }
    }
  `;

  private onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.checked && !this.checked) {
      this.checked = true;
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  }

  render() {
    return html`
      <label part="label">
        <input
          type="radio"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.onChange}
        />
        <span class="circle" part="control" aria-hidden="true"><span class="dot"></span></span>
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-radio': StrataRadio;
  }
}
