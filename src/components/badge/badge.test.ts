import { fixture, expect, html } from '@open-wc/testing';
import './badge.js';
import type { StrataBadge } from './badge.js';

describe('strata-badge', () => {
  it('renders slotted content in a pill', async () => {
    const el = await fixture<StrataBadge>(html`<strata-badge>Active</strata-badge>`);
    expect(el.shadowRoot!.querySelector('.badge')).to.exist;
    expect(el.textContent).to.equal('Active');
  });

  it('defaults to the neutral tone', async () => {
    const el = await fixture<StrataBadge>(html`<strata-badge>x</strata-badge>`);
    expect(el.tone).to.equal('neutral');
    expect(el.getAttribute('tone')).to.equal('neutral');
  });

  it('reflects each tone attribute', async () => {
    for (const tone of ['neutral', 'accent', 'success', 'warning', 'danger'] as const) {
      const el = await fixture<StrataBadge>(
        html`<strata-badge tone=${tone}>x</strata-badge>`
      );
      expect(el.getAttribute('tone')).to.equal(tone);
    }
  });

  it('is accessible in all tones', async () => {
    for (const tone of ['neutral', 'accent', 'success', 'warning', 'danger'] as const) {
      const el = await fixture<StrataBadge>(
        html`<strata-badge tone=${tone}>Label</strata-badge>`
      );
      await expect(el).to.be.accessible();
    }
  });
});
