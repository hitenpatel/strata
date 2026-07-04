import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

@customElement('strata-dialog')
export class StrataDialog extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property() heading = '';

  @query('dialog') private dialogEl!: HTMLDialogElement;

  static styles = css`
    :host {
      display: contents;
    }
    dialog {
      width: min(480px, calc(100vw - var(--strata-space-6, 32px)));
      box-sizing: border-box;
      margin: auto;
      padding: var(--strata-space-5, 24px);
      background: var(--strata-surface, #fff);
      color: var(--strata-text, #0f172a);
      border: 1px solid var(--strata-border, #e2e8f0);
      border-radius: var(--strata-radius-xl, 20px);
      box-shadow: var(--strata-shadow-lg, 0 12px 32px rgba(15, 23, 42, 0.14));
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    dialog[open] {
      animation: dialog-in var(--strata-duration-slow, 320ms) var(--strata-easing-default, ease);
    }
    dialog::backdrop {
      background: var(--strata-scrim, rgba(15, 23, 42, 0.5));
      animation: overlay-in var(--strata-duration-slow, 320ms) var(--strata-easing-default, ease);
    }
    h2 {
      margin: 0 0 var(--strata-space-2, 8px);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--strata-text, #0f172a);
    }
    .body {
      font-size: 14px;
      line-height: 1.6;
      color: var(--strata-text-muted, #475569);
    }
    footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--strata-space-3, 12px);
      margin-top: var(--strata-space-5, 24px);
    }
    @keyframes dialog-in {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    @keyframes overlay-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      dialog[open],
      dialog::backdrop {
        animation: none;
      }
    }
  `;

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('open')) {
      if (this.open && !this.dialogEl.open) {
        this.dialogEl.showModal();
      } else if (!this.open && this.dialogEl.open) {
        this.dialogEl.close();
      }
    }
  }

  private handleNativeClose = (): void => {
    this.open = false;
    this.dispatchEvent(new Event('close', { bubbles: true, composed: true }));
  };

  render() {
    return html`
      <dialog aria-labelledby="heading" @close=${this.handleNativeClose}>
        <h2 id="heading">${this.heading}</h2>
        <div class="body"><slot></slot></div>
        <footer><slot name="footer"></slot></footer>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-dialog': StrataDialog;
  }
}
