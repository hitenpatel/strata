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
      /* Sediment slab: severity band + tone chip colours, overridden per
         tone below. */
      --_band: var(--strata-band-accent, #2563eb);
      --_tone: var(--strata-accent, #2563eb);
      --_tone-subtle: var(--strata-accent-subtle, #eef4ff);
    }
    :host([hidden]) {
      display: none;
    }
    .toast {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 11px;
      /* Extra left padding clears the 3px severity band. */
      padding: 12px 14px 12px 17px;
      border-radius: var(--strata-radius-lg, 8px);
      background: var(--strata-surface-raised, #fff);
      border: var(--strata-border-width, 1.5px) solid
        var(--strata-border-strong, #d6cec1);
      /* 3px strata band inset on the left, layered over the offset-2 solid
         shadow + two echoed under-edges (composed in shadow-md). */
      box-shadow:
        inset 3px 0 0 0 var(--_band),
        var(
          --strata-shadow-md,
          4px 4px 0 0 #d6cec1,
          0 5px 0 -1px #d6cec1,
          0 8px 0 -2px #e7e1d8
        );
      font-family: var(--strata-font-body, system-ui, sans-serif);
      animation: enter var(--strata-duration-slow, 320ms)
        var(--strata-easing-settle, ease) both;
    }
    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      box-sizing: border-box;
      border-radius: var(--strata-radius-sm, 4px);
      border: var(--strata-border-width, 1.5px) solid var(--_tone);
      background: var(--_tone-subtle);
      color: var(--_tone);
      flex: none;
    }
    :host([tone='success']) {
      --_band: var(--strata-band-success, #16a34a);
      --_tone: var(--strata-success, #16a34a);
      --_tone-subtle: var(--strata-success-subtle, #eefaf1);
    }
    :host([tone='danger']) {
      --_band: var(--strata-band-danger, #dc2626);
      --_tone: var(--strata-danger, #dc2626);
      --_tone-subtle: var(--strata-danger-subtle, #fdf0ee);
    }
    .body {
      flex: 1;
      min-width: 0;
      padding-top: 2px;
    }
    .heading {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--strata-text, #231f1a);
      margin-bottom: 2px;
    }
    .message {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--strata-text, #231f1a);
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
      color: var(--strata-text-subtle, #8c8271);
      cursor: pointer;
      transition:
        background-color var(--strata-duration-fast, 120ms)
          var(--strata-easing-default, ease),
        color var(--strata-duration-fast, 120ms)
          var(--strata-easing-default, ease);
    }
    .dismiss:hover {
      background: var(--strata-surface-hover, #faf8f5);
      color: var(--strata-text, #231f1a);
    }
    .dismiss:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    /* Slide up from the region edge, overshoot 3px, settle on the pile. */
    @keyframes enter {
      0% {
        opacity: 0;
        transform: translateY(16px);
      }
      70% {
        transform: translateY(-3px);
      }
      100% {
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
