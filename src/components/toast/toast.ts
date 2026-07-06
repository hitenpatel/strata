import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ToastTone = 'info' | 'success' | 'danger';

const icons = {
  info: html`<svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="8" x2="12" y2="8"></line>
    <line x1="12" y1="12" x2="12" y2="16"></line>
  </svg>`,
  success: html`<svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>`,
  danger: html`<svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="14"></line>
    <line x1="12" y1="19" x2="12" y2="19"></line>
  </svg>`,
};

@customElement('strata-toast')
export class StrataToast extends LitElement {
  @property({ reflect: true }) tone: ToastTone = 'info';
  @property() heading = '';

  static styles = css`
    :host {
      display: block;
      /* Severity is carried by the leading icon's tone colour only —
         overridden per tone below. */
      --_tone: var(--strata-accent, #2563eb);
    }
    :host([hidden]) {
      display: none;
    }
    .toast {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      border-radius: var(--strata-radius-lg, 8px);
      background: var(--strata-surface, #fff);
      border: var(--strata-border-width, 1px) solid var(--strata-border, #e4e4e7);
      box-shadow: var(
        --strata-shadow-lg,
        0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1)
      );
      font-family: var(--strata-font-body, system-ui, sans-serif);
      animation: enter var(--strata-duration-base, 200ms)
        var(--strata-easing-out, ease-out) both;
    }
    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      margin-top: 2px;
      color: var(--_tone);
      flex: none;
    }
    :host([tone='success']) {
      --_tone: var(--strata-success, #16a34a);
    }
    :host([tone='danger']) {
      --_tone: var(--strata-danger, #dc2626);
    }
    .body {
      flex: 1;
      min-width: 0;
      padding-top: 2px;
    }
    .heading {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--strata-text, #09090b);
      margin-bottom: 2px;
    }
    .message {
      font-size: 13.5px;
      font-weight: 400;
      color: var(--strata-text, #09090b);
      line-height: 1.5;
    }
    .dismiss {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      flex: none;
      padding: 0;
      border: none;
      border-radius: var(--strata-radius-sm, 4px);
      background: transparent;
      color: var(--strata-text-muted, #71717a);
      cursor: pointer;
      transition:
        background-color var(--strata-duration-fast, 150ms)
          var(--strata-easing-default, ease),
        color var(--strata-duration-fast, 150ms)
          var(--strata-easing-default, ease);
    }
    .dismiss:hover {
      background: var(--strata-surface-hover, #f4f4f5);
      color: var(--strata-text, #09090b);
    }
    .dismiss:focus-visible {
      outline: 2px solid var(--strata-focus-ring, #2563eb);
      outline-offset: 2px;
    }
    /* Slide up 8px + fade. */
    @keyframes enter {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation-name: fade;
      }
      .dismiss {
        transition: none;
      }
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;

  private onDismiss() {
    const proceed = this.dispatchEvent(
      new CustomEvent('strata-dismiss', {
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
    if (proceed) this.remove();
  }

  render() {
    return html`
      <div class="toast" part="toast" role=${this.tone === 'danger' ? 'alert' : 'status'}>
        <span class="icon">${icons[this.tone]}</span>
        <div class="body">
          ${this.heading
            ? html`<div class="heading" part="heading">${this.heading}</div>`
            : nothing}
          <div class="message" part="message"><slot></slot></div>
        </div>
        <button class="dismiss" part="dismiss" aria-label="Dismiss" @click=${this.onDismiss}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;
  }
}

@customElement('strata-toast-region')
export class StrataToastRegion extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      right: var(--strata-space-5, 24px);
      bottom: var(--strata-space-5, 24px);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--strata-space-3, 12px);
      max-width: min(380px, calc(100vw - 2 * var(--strata-space-5, 24px)));
    }
    :host([hidden]) {
      display: none;
    }
    ::slotted(strata-toast) {
      width: 100%;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'region');
    this.setAttribute('aria-label', 'Notifications');
    this.setAttribute('aria-live', 'polite');
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-toast': StrataToast;
    'strata-toast-region': StrataToastRegion;
  }
}
