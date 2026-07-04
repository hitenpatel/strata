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
      color: var(--strata-text, #0f172a);
    }
    input {
      height: 40px;
      padding: 0 var(--strata-space-3, 12px);
      border-radius: var(--strata-radius-md, 10px);
      border: 1px solid var(--strata-border-strong, #cbd5e1);
      background: var(--strata-surface, #fff);
      color: var(--strata-text, #0f172a);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      width: 100%;
      box-sizing: border-box;
      transition:
        border-color var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease),
        box-shadow var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease);
    }
    input::placeholder {
      color: var(--strata-text-subtle, #94a3b8);
    }
    input:focus-visible {
      border-color: var(--strata-accent, #2563eb);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--strata-focus-ring, #2563eb) 30%, transparent);
    }
    input:disabled {
      border-color: var(--strata-border, #e2e8f0);
      background: var(--strata-surface-sunken, #f1f5f9);
      color: var(--strata-text-subtle, #94a3b8);
      cursor: not-allowed;
    }
    :host([data-invalid]) input:not(:disabled) {
      border-color: var(--strata-danger, #dc2626);
      background: var(--strata-danger-subtle, #fef2f2);
    }
    .hint {
      font-size: 12px;
      color: var(--strata-text-muted, #475569);
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
      <div class="field">
        ${this.label ? html`<label for="control">${this.label}</label>` : nothing}
        <input
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
          ? html`<span class="error" id="error">${this.renderErrorIcon()}${this.error}</span>`
          : nothing}
        ${this.hint ? html`<span class="hint" id="hint">${this.hint}</span>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-input': StrataInput;
  }
}
