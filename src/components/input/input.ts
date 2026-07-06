import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

@customElement('strata-input')
export class StrataInput extends LitElement {
  static formAssociated = true;

  @property() label = '';
  @property() type = 'text';
  @property() value = '';
  @property() placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property() error = '';
  @property() hint = '';
  @property() name = '';

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    :host([hidden]) {
      display: none;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    label {
      font-size: 13px;
      font-weight: 500;
      color: var(--strata-text, #09090b);
    }
    input {
      height: 40px;
      padding: 0 var(--strata-space-3, 12px);
      border-radius: var(--strata-radius-md, 6px);
      border: var(--strata-border-width, 1px) solid var(--strata-border, #e4e4e7);
      background: var(--strata-surface, #fff);
      color: var(--strata-text, #09090b);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      width: 100%;
      box-sizing: border-box;
      box-shadow: var(--strata-shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05));
      transition: border-color var(--strata-duration-fast, 150ms)
        var(--strata-easing-default, ease);
    }
    input::placeholder {
      color: var(--strata-text-muted, #71717a);
    }
    input:focus-visible {
      border-color: var(--strata-focus-ring, #2563eb);
      outline: 2px solid var(--strata-focus-ring, #2563eb);
      outline-offset: -1px;
    }
    input:disabled {
      background: var(--strata-surface-sunken, #f4f4f5);
      color: var(--strata-text-muted, #71717a);
      cursor: not-allowed;
      opacity: 0.7;
      box-shadow: none;
    }
    :host([data-invalid]) input:not(:disabled) {
      border-color: var(--strata-danger, #dc2626);
    }
    :host([data-invalid]) input:not(:disabled):focus-visible {
      outline-color: var(--strata-danger, #dc2626);
    }
    .hint {
      font-size: 12px;
      color: var(--strata-text-muted, #71717a);
    }
    .error {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: var(--strata-danger, #dc2626);
    }
    @media (prefers-reduced-motion: reduce) {
      input {
        transition: none;
      }
    }
  `;

  private onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.internals.setFormValue(this.value);
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  private onChange() {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this.internals.setFormValue(this.value);
    }
    if (changed.has('error')) {
      this.toggleAttribute('data-invalid', !!this.error);
    }
  }

  private renderErrorIcon() {
    return html`<svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>`;
  }

  render() {
    const describedBy =
      [this.error ? 'error' : '', this.hint ? 'hint' : ''].filter(Boolean).join(' ') || nothing;
    return html`
      <div class="field" part="field">
        ${this.label ? html`<label part="label" for="control">${this.label}</label>` : nothing}
        <input
          part="input"
          id="control"
          type=${this.type}
          .value=${live(this.value)}
          placeholder=${this.placeholder || nothing}
          name=${this.name || nothing}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-invalid=${this.error ? 'true' : nothing}
          aria-describedby=${describedBy}
          @input=${this.onInput}
          @change=${this.onChange}
        />
        ${this.error
          ? html`<span class="error" part="error" id="error"
              >${this.renderErrorIcon()}${this.error}</span
            >`
          : nothing}
        ${this.hint
          ? html`<span class="hint" part="hint" id="hint">${this.hint}</span>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-input': StrataInput;
  }
}
