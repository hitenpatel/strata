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
    }
    :host([hidden]) {
      display: none;
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 11px;
      padding: 12px 14px;
      border-radius: var(--strata-radius-md, 10px);
      background: var(--strata-surface-raised, #fff);
      border: 1px solid var(--strata-border, #e2e8f0);
      box-shadow: var(--strata-shadow-md, 0 4px 12px rgba(15, 23, 42, 0.1));
      font-family: var(--strata-font-body, system-ui, sans-serif);
      animation: enter var(--strata-duration-base, 200ms)
        var(--strata-easing-default, ease) both;
    }
    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: var(--strata-radius-full, 999px);
      flex: none;
    }
    :host([tone='info']) .icon {
      background: var(--strata-accent-subtle, #eff6ff);
      color: var(--strata-accent, #2563eb);
    }
    :host([tone='success']) .icon {
      background: var(--strata-success-subtle, #f0fdf4);
      color: var(--strata-success, #16a34a);
    }
    :host([tone='danger']) .icon {
      background: var(--strata-danger-subtle, #fef2f2);
      color: var(--strata-danger, #dc2626);
    }
    .body {
      flex: 1;
      min-width: 0;
      padding-top: 2px;
    }
    .heading {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--strata-text, #0f172a);
      margin-bottom: 2px;
    }
    .message {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--strata-text, #0f172a);
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
      border-radius: var(--strata-radius-sm, 6px);
      background: transparent;
      color: var(--strata-text-subtle, #64748b);
      cursor: pointer;
      transition:
        background-color var(--strata-duration-fast, 120ms)
          var(--strata-easing-default, ease),
        color var(--strata-duration-fast, 120ms)
          var(--strata-easing-default, ease);
    }
    .dismiss:hover {
      background: var(--strata-surface-hover, #f8fafc);
      color: var(--strata-text, #0f172a);
    }
    .dismiss:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    @keyframes enter {
      from {
        opacity: 0;
        transform: translateY(14px);
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
      <div class="toast" role=${this.tone === 'danger' ? 'alert' : 'status'}>
        <span class="icon">${icons[this.tone]}</span>
        <div class="body">
          ${this.heading
            ? html`<div class="heading">${this.heading}</div>`
            : nothing}
          <div class="message"><slot></slot></div>
        </div>
        <button class="dismiss" aria-label="Dismiss" @click=${this.onDismiss}>
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
