import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

@customElement('strata-breadcrumb')
export class StrataBreadcrumb extends LitElement {
  @property({ attribute: false }) items: BreadcrumbItem[] = [];

  static styles = css`
    :host {
      display: block;
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    :host([hidden]) {
      display: none;
    }
    ol {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--strata-space-2, 8px);
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 14px;
    }
    a {
      color: var(--strata-text-muted, #71717a);
      text-decoration: none;
      border-radius: var(--strata-radius-sm, 4px);
      transition: color var(--strata-duration-fast, 150ms) var(--strata-easing-default, ease);
    }
    a:hover {
      color: var(--strata-text, #09090b);
    }
    a:focus-visible {
      outline: 2px solid var(--strata-focus-ring, #2563eb);
      outline-offset: 2px;
    }
    .separator {
      color: var(--strata-text-subtle, #a1a1aa);
      user-select: none;
    }
    [aria-current='page'] {
      color: var(--strata-text, #09090b);
      font-weight: 600;
    }
    @media (prefers-reduced-motion: reduce) {
      a {
        transition: none;
      }
    }
  `;

  render() {
    const last = this.items.length - 1;
    return html`
      <nav part="nav" aria-label="Breadcrumb">
        <ol part="list">
          ${this.items.map((item, i) => {
            const isLast = i === last;
            return html`
              <li part=${isLast ? 'current' : nothing} aria-current=${isLast ? 'page' : nothing}>
                ${!isLast && item.href
                  ? html`<a part="link" href=${item.href}>${item.label}</a>`
                  : html`${item.label}`}
              </li>
              ${!isLast
                ? html`<li class="separator" aria-hidden="true">/</li>`
                : nothing}
            `;
          })}
        </ol>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-breadcrumb': StrataBreadcrumb;
  }
}
