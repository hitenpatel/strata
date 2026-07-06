import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

@customElement('strata-button')
export class StrataButton extends LitElement {
  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property() type: 'button' | 'submit' | 'reset' = 'button';

  static styles = css`
    :host {
      display: inline-block;
      --_bg: var(--strata-accent, #2563eb);
      --_bg-hover: var(--strata-accent-hover, #1d4ed8);
      --_fg: var(--strata-on-accent, #fff);
      --_border: transparent;
    }
    :host([hidden]) {
      display: none;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--strata-space-2, 8px);
      height: 40px;
      padding: 0 16px;
      border-radius: var(--strata-radius-md, 6px);
      border: var(--strata-border-width, 1px) solid var(--_border);
      background: var(--_bg);
      color: var(--_fg);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 14px;
      font-weight: 500;
      line-height: 1;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: var(--strata-shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05));
      transition:
        background-color var(--strata-duration-fast, 150ms) var(--strata-easing-default, ease),
        border-color var(--strata-duration-fast, 150ms) var(--strata-easing-default, ease),
        color var(--strata-duration-fast, 150ms) var(--strata-easing-default, ease);
    }
    button:hover:not(:disabled) {
      background: var(--_bg-hover);
    }
    button:focus-visible {
      outline: 2px solid var(--strata-focus-ring, #2563eb);
      outline-offset: 2px;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    :host([loading]) button:disabled {
      opacity: 0.8;
      cursor: progress;
    }

    :host([variant='secondary']) {
      --_bg: var(--strata-surface, #fff);
      --_bg-hover: var(--strata-surface-hover, #f4f4f5);
      --_fg: var(--strata-text, #09090b);
      --_border: var(--strata-border, #e4e4e7);
    }

    :host([variant='ghost']) {
      --_bg: transparent;
      --_bg-hover: var(--strata-surface-hover, #f4f4f5);
      --_fg: var(--strata-text, #09090b);
    }
    :host([variant='ghost']) button {
      box-shadow: none;
    }

    :host([variant='danger']) {
      --_bg: var(--strata-danger, #dc2626);
      --_bg-hover: var(--strata-danger-hover, #b91c1c);
      --_fg: var(--strata-on-danger, #fff);
    }

    .spinner {
      width: 14px;
      height: 14px;
      flex: none;
      border-radius: var(--strata-radius-full, 999px);
      border: 2px solid currentColor;
      border-right-color: transparent;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
      .spinner {
        animation: none;
        opacity: 0.6;
      }
    }
  `;

  render() {
    return html`
      <button
        part="button"
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : nothing}
      >
        ${this.loading
          ? html`<span part="spinner" class="spinner" aria-hidden="true"></span>`
          : nothing}
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-button': StrataButton;
  }
}
