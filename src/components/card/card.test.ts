import { fixture, expect, html } from '@open-wc/testing';
import './card.js';
import type { StrataCard } from './card.js';

describe('strata-card', () => {
  it('renders default slot content in the body', async () => {
    const el = await fixture<StrataCard>(html`<strata-card><p>Body</p></strata-card>`);
    expect(el.shadowRoot!.querySelector('.body')).to.exist;
    expect(el.textContent!.trim()).to.equal('Body');
  });

  it('hides header and footer wrappers when their slots are empty', async () => {
    const el = await fixture<StrataCard>(html`<strata-card>Body</strata-card>`);
    expect(el.shadowRoot!.querySelector('.header')!.hasAttribute('hidden')).to.be
      .true;
    expect(el.shadowRoot!.querySelector('.footer')!.hasAttribute('hidden')).to.be
      .true;
  });

  it('shows header and footer with separators when populated', async () => {
    const el = await fixture<StrataCard>(html`
      <strata-card>
        <span slot="header">Header</span>
        Body
        <span slot="footer">Footer</span>
      </strata-card>
    `);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.header')!.hasAttribute('hidden')).to.be
      .false;
    expect(el.shadowRoot!.querySelector('.footer')!.hasAttribute('hidden')).to.be
      .false;
  });

  it('reflects the raised attribute', async () => {
    const el = await fixture<StrataCard>(html`<strata-card raised>x</strata-card>`);
    expect(el.raised).to.be.true;
    expect(el.hasAttribute('raised')).to.be.true;
  });

  it('is accessible with and without named slots', async () => {
    const plain = await fixture<StrataCard>(html`<strata-card>Content</strata-card>`);
    await expect(plain).to.be.accessible();

    const full = await fixture<StrataCard>(html`
      <strata-card raised>
        <span slot="header">Header</span>
        Content
        <span slot="footer">Footer</span>
      </strata-card>
    `);
    await expect(full).to.be.accessible();
  });
});
