import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('strata-card')
export class StrataCard extends LitElement {
  @property({ type: Boolean, reflect: true }) raised = false;

  @state() private hasHeader = false;
  @state() private hasFooter = false;

  static styles = css`
    :host {
      /* Sediment flagship slab: solid offset-2 shadow + two echoed
         under-edges (composed inside the shadow-md token). */
      display: block;
      background: var(--strata-surface, #fff);
      border: var(--strata-border-width, 1.5px) solid
        var(--strata-border-strong, #d6cec1);
      border-radius: var(--strata-radius-lg, 8px);
      box-shadow: var(
        --strata-shadow-md,
        4px 4px 0 0 #d6cec1,
        0 5px 0 -1px #d6cec1,
        0 8px 0 -2px #e7e1d8
      );
      color: var(--strata-text, #231f1a);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      overflow: hidden;
      transition:
        transform 180ms var(--strata-easing-settle, ease),
        box-shadow 180ms var(--strata-easing-settle, ease);
    }
    :host([hidden]) {
      display: none;
    }
    :host([raised]) {
      background: var(--strata-surface-raised, #fff);
    }
    /* Raised = interactive: the slab lifts off its stratum on hover. */
    :host([raised]:hover) {
      transform: translate(-2px, -2px);
      box-shadow:
        6px 6px 0 0 var(--strata-layer-shadow, #d6cec1),
        0 6px 0 -1px var(--strata-layer-edge-1, #d6cec1),
        0 10px 0 -2px var(--strata-layer-edge-2, #e7e1d8);
    }
    .header,
    .body,
    .footer {
      padding: var(--strata-space-4, 16px) 22px;
    }
    .body {
      padding: 22px;
    }
    .header {
      /* Hairline separators are for internal structure only (rule 4). */
      border-bottom: 1px solid var(--strata-border, #e7e1d8);
      font-weight: 600;
    }
    .footer {
      border-top: 1px solid var(--strata-border, #e7e1d8);
      background: var(--strata-surface-hover, #faf8f5);
    }
    [hidden] {
      display: none;
    }
    @media (prefers-reduced-motion: reduce) {
      :host {
        transition: none;
      }
      :host([raised]:hover) {
        transform: none;
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
      <div class="header" ?hidden=${!this.hasHeader}>
        <slot name="header" @slotchange=${this.onHeaderSlot}></slot>
      </div>
      <div class="body"><slot></slot></div>
      <div class="footer" ?hidden=${!this.hasFooter}>
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
