import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

@customElement('strata-icon-button')
export class StrataIconButton extends LitElement {
  @property({ reflect: true }) variant: IconButtonVariant = 'secondary';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() label = '';
  @property() type: 'button' | 'submit' | 'reset' = 'button';

  static styles = css`
    :host {
      display: inline-block;
    }
    :host([hidden]) {
      display: none;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: var(--strata-radius-md, 10px);
      border: 1px solid transparent;
      font-family: var(--strata-font-body, system-ui, sans-serif);
      cursor: pointer;
      transition:
        background-color var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease),
        border-color var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease),
        color var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease),
        box-shadow var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease),
        transform var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease);
    }
    button:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    button:active:not(:disabled) {
      transform: translateY(1px);
    }
    button:disabled {
      opacity: 0.42;
      cursor: not-allowed;
    }
    ::slotted(svg) {
      width: 18px;
      height: 18px;
      flex: none;
    }

    :host([variant='primary']) button {
      background: var(--strata-accent, #2563eb);
      color: var(--strata-on-accent, #fff);
    }
    :host([variant='primary']) button:hover:not(:disabled) {
      background: var(--strata-accent-hover, #1d4ed8);
    }

    :host([variant='secondary']) button {
      background: var(--strata-surface, #fff);
      border-color: var(--strata-border-strong, #cbd5e1);
      color: var(--strata-text-muted, #475569);
    }
    :host([variant='secondary']) button:hover:not(:disabled) {
      background: var(--strata-surface-hover, #f8fafc);
      color: var(--strata-text, #0f172a);
    }

    :host([variant='ghost']) button {
      background: transparent;
      color: var(--strata-text-muted, #475569);
    }
    :host([variant='ghost']) button:hover:not(:disabled) {
      background: var(--strata-surface-hover, #f8fafc);
      color: var(--strata-text, #0f172a);
    }

    :host([variant='danger']) button {
      background: var(--strata-danger, #dc2626);
      color: var(--strata-on-danger, #fff);
    }
    :host([variant='danger']) button:hover:not(:disabled) {
      background: var(--strata-danger-hover, #b91c1c);
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
      button:active:not(:disabled) {
        transform: none;
      }
    }
  `;

  render() {
    return html`
      <button type=${this.type} ?disabled=${this.disabled} aria-label=${this.label}>
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-icon-button': StrataIconButton;
  }
}
