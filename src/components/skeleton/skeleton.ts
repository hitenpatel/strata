import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

@customElement('strata-skeleton')
export class StrataSkeleton extends LitElement {
  @property({ reflect: true }) variant: SkeletonVariant = 'text';
  @property() width = '';
  @property() height = '';

  static styles = css`
    :host {
      /* Sediment layered loading: a neutral base slab with a gradient
         sweep sliding across it (sediment shifting). */
      display: block;
      position: relative;
      overflow: hidden;
      background: var(--strata-border, #e7e1d8);
    }
    :host([hidden]) {
      display: none;
    }
    :host([variant='text']) {
      height: 12px;
      border-radius: var(--strata-radius-sm, 4px);
    }
    :host([variant='circle']) {
      width: 48px;
      height: 48px;
      border-radius: var(--strata-radius-full, 999px);
    }
    :host([variant='rect']) {
      height: 80px;
      border-radius: var(--strata-radius-md, 6px);
    }
    .sweep {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.35),
        transparent
      );
      animation: strata-shimmer 1.5s var(--strata-easing-drop, ease) infinite;
    }
    @keyframes strata-shimmer {
      0% {
        transform: translateX(-60%);
      }
      100% {
        transform: translateX(160%);
      }
    }
    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.55;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      /* Shimmer sweep replaced by a gentle opacity pulse on the slab. */
      .sweep {
        animation: none;
        opacity: 0.5;
      }
      :host {
        animation: pulse 1.4s var(--strata-easing-default, ease) infinite;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
  }

  protected updated(changed: PropertyValues) {
    if (changed.has('width')) {
      this.style.width = this.width || '';
    }
    if (changed.has('height')) {
      this.style.height = this.height || '';
    }
  }

  render() {
    // Purely presentational sweep layer; the host is aria-hidden.
    return html`<span class="sweep"></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-skeleton': StrataSkeleton;
  }
}
