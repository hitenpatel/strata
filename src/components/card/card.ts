import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('strata-card')
export class StrataCard extends LitElement {
  @property({ type: Boolean, reflect: true }) raised = false;

  @state() private hasHeader = false;
  @state() private hasFooter = false;

  static styles = css`
    :host {
      display: block;
      background: var(--strata-surface, #fff);
      border: var(--strata-border-width, 1px) solid var(--strata-border, #e4e4e7);
      border-radius: var(--strata-radius-lg, 8px);
      box-shadow: var(--strata-shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05));
      color: var(--strata-text, #09090b);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      overflow: hidden;
      transition: box-shadow var(--strata-duration-fast, 150ms)
        var(--strata-easing-default, ease);
    }
    :host([hidden]) {
      display: none;
    }
    :host([raised]) {
      background: var(--strata-surface-raised, #fff);
      box-shadow: var(
        --strata-shadow-sm,
        0 1px 3px 0 rgb(0 0 0 / 0.1),
        0 1px 2px -1px rgb(0 0 0 / 0.1)
      );
    }
    :host([raised]:hover) {
      box-shadow: var(
        --strata-shadow-md,
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1)
      );
    }
    .header,
    .body,
    .footer {
      padding: var(--strata-space-4, 16px) var(--strata-space-5, 24px);
    }
    .body {
      padding: var(--strata-space-5, 24px);
    }
    .header {
      border-bottom: 1px solid var(--strata-border, #e4e4e7);
      font-weight: 600;
    }
    .footer {
      border-top: 1px solid var(--strata-border, #e4e4e7);
      background: var(--strata-surface-sunken, #f4f4f5);
    }
    [hidden] {
      display: none;
    }
    @media (prefers-reduced-motion: reduce) {
      :host {
        transition: none;
      }
    }
  `;

  private onHeaderSlot(e: Event) {
    this.hasHeader =
      (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  }

  private onFooterSlot(e: Event) {
    this.hasFooter =
      (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  }

  render() {
    return html`
      <div class="header" part="header" ?hidden=${!this.hasHeader}>
        <slot name="header" @slotchange=${this.onHeaderSlot}></slot>
      </div>
      <div class="body" part="body"><slot></slot></div>
      <div class="footer" part="footer" ?hidden=${!this.hasFooter}>
        <slot name="footer" @slotchange=${this.onFooterSlot}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-card': StrataCard;
  }
}
