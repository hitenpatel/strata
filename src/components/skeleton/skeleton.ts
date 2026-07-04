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
      background: linear-gradient(
        90deg,
        var(--strata-surface-sunken, #f1f5f9) 25%,
        var(--strata-border, #e2e8f0) 50%,
        var(--strata-surface-sunken, #f1f5f9) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.4s linear infinite;
    }
    :host([hidden]) {
      display: none;
    }
    :host([variant='text']) {
      height: 12px;
      border-radius: var(--strata-radius-sm, 6px);
    }
    :host([variant='circle']) {
      width: 48px;
      height: 48px;
      border-radius: var(--strata-radius-full, 999px);
    }
    :host([variant='rect']) {
      height: 80px;
      border-radius: var(--strata-radius-md, 10px);
    }
    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
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
      :host {
        background: var(--strata-surface-sunken, #f1f5f9);
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
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-skeleton': StrataSkeleton;
  }
}
