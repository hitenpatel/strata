import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type AvatarSize = 'sm' | 'md' | 'lg';

@customElement('strata-avatar')
export class StrataAvatar extends LitElement {
  @property() src = '';
  @property() name = '';
  @property({ reflect: true }) size: AvatarSize = 'md';

  static styles = css`
    :host {
      display: inline-flex;
      flex: none;
    }
    :host([hidden]) {
      display: none;
    }
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: var(--strata-radius-full, 999px);
      background: var(--strata-accent-subtle, #eff6ff);
      color: var(--strata-accent, #2563eb);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-weight: 600;
      user-select: none;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    :host([size='sm']) .avatar {
      width: 24px;
      height: 24px;
      font-size: 10px;
    }
    :host([size='md']) .avatar {
      width: 32px;
      height: 32px;
      font-size: 13px;
    }
    :host([size='lg']) .avatar {
      width: 40px;
      height: 40px;
      font-size: 15px;
    }
  `;

  private get initials(): string {
    return this.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  render() {
    if (this.src) {
      return html`
        <span class="avatar">
          <img src=${this.src} alt=${this.name} />
        </span>
      `;
    }
    return html`
      <span
        class="avatar"
        role=${this.name ? 'img' : nothing}
        aria-label=${this.name || nothing}
        aria-hidden=${this.name ? nothing : 'true'}
        >${this.initials}</span
      >
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-avatar': StrataAvatar;
  }
}
