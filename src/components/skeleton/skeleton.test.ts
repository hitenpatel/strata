import { fixture, expect, html } from '@open-wc/testing';
import './skeleton.js';
import type { StrataSkeleton } from './skeleton.js';

describe('strata-skeleton', () => {
  it('is hidden from assistive technology', async () => {
    const el = await fixture<StrataSkeleton>(
      html`<strata-skeleton></strata-skeleton>`
    );
    expect(el.getAttribute('aria-hidden')).to.equal('true');
  });

  it('defaults to the text variant and reflects each variant', async () => {
    const el = await fixture<StrataSkeleton>(
      html`<strata-skeleton></strata-skeleton>`
    );
    expect(el.getAttribute('variant')).to.equal('text');
    for (const variant of ['text', 'circle', 'rect'] as const) {
      const v = await fixture<StrataSkeleton>(
        html`<strata-skeleton variant=${variant}></strata-skeleton>`
      );
      expect(v.getAttribute('variant')).to.equal(variant);
    }
  });

  it('applies width and height properties as inline styles', async () => {
    const el = await fixture<StrataSkeleton>(
      html`<strata-skeleton width="120px" height="20px"></strata-skeleton>`
    );
    expect(el.style.width).to.equal('120px');
    expect(el.style.height).to.equal('20px');
    expect(getComputedStyle(el).width).to.equal('120px');
    expect(getComputedStyle(el).height).to.equal('20px');
  });

  it('sizes circle variant equally by default', async () => {
    const el = await fixture<StrataSkeleton>(
      html`<strata-skeleton variant="circle"></strata-skeleton>`
    );
    const cs = getComputedStyle(el);
    expect(cs.width).to.equal('48px');
    expect(cs.height).to.equal('48px');
  });

  it('is accessible in all variants', async () => {
    for (const variant of ['text', 'circle', 'rect'] as const) {
      const el = await fixture<StrataSkeleton>(
        html`<strata-skeleton variant=${variant}></strata-skeleton>`
      );
      await expect(el).to.be.accessible();
    }
  });
});
