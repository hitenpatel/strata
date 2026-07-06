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
      display: block;
      overflow: hidden;
    }
    :host([hidden]) {
      display: none;
    }
    :host([variant='text']) {
      height: 12px;
      border-radius: var(--strata-radius-md, 6px);
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
    .skeleton {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: var(--strata-surface-sunken, #f4f4f5);
      animation: pulse 2s var(--strata-easing-default, ease-in-out) infinite;
    }
    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .skeleton {
        animation: none;
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
    // Purely presentational fill; the host is aria-hidden.
    return html`<span class="skeleton" part="skeleton"></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-skeleton': StrataSkeleton;
  }
}
