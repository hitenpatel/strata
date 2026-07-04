import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('strata-checkbox')
export class StrataCheckbox extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property() name = '';
  @property() value = 'on';

  @query('input') private input!: HTMLInputElement;

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
      color: var(--strata-text, #0f172a);
      cursor: pointer;
      user-select: none;
    }
    :host([disabled]) label {
      cursor: not-allowed;
      color: var(--strata-text-subtle, #94a3b8);
    }
    input {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: 0;
      opacity: 0;
      pointer-events: none;
    }
    .box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      flex: none;
      border-radius: 5px;
      border: 1.5px solid var(--strata-border-strong, #cbd5e1);
      background: var(--strata-surface, #fff);
      color: var(--strata-on-accent, #fff);
      box-sizing: border-box;
      transition:
        background-color var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease),
        border-color var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease),
        box-shadow var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease);
    }
    :host([checked]) .box,
    :host([indeterminate]) .box {
      border-color: var(--strata-accent, #2563eb);
      background: var(--strata-accent, #2563eb);
    }
    :host([disabled]) .box {
      border-color: var(--strata-border, #e2e8f0);
      background: var(--strata-surface-sunken, #f1f5f9);
      color: var(--strata-text-subtle, #94a3b8);
      opacity: 0.6;
    }
    input:focus-visible + .box {
      box-shadow:
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    .check,
    .dash {
      display: none;
    }
    :host([checked]:not([indeterminate])) .check {
      display: block;
    }
    :host([indeterminate]) .dash {
      display: block;
      width: 9px;
      height: 2.5px;
      background: currentColor;
      border-radius: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      .box {
        transition: none;
      }
    }
  `;

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('indeterminate')) {
      this.input.indeterminate = this.indeterminate;
    }
  }

  private onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = false;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <label>
        <input
          type="checkbox"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          @change=${this.onChange}
        />
        <span class="box" aria-hidden="true">
          <svg
            class="check"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span class="dash"></span>
        </span>
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-checkbox': StrataCheckbox;
  }
}
