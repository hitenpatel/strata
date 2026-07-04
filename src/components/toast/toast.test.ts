import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import './toast.js';
import type { StrataToast, StrataToastRegion } from './toast.js';

describe('strata-toast', () => {
  it('renders heading and slotted message', async () => {
    const el = await fixture<StrataToast>(html`
      <strata-toast heading="Saved">Settings updated.</strata-toast>
    `);
    expect(el.shadowRoot!.querySelector('.heading')!.textContent).to.equal(
      'Saved'
    );
    expect(el.textContent).to.equal('Settings updated.');
  });

  it('uses role="status" for info and success', async () => {
    for (const tone of ['info', 'success'] as const) {
      const el = await fixture<StrataToast>(
        html`<strata-toast tone=${tone}>msg</strata-toast>`
      );
      expect(
        el.shadowRoot!.querySelector('.toast')!.getAttribute('role')
      ).to.equal('status');
    }
  });

  it('uses role="alert" for danger', async () => {
    const el = await fixture<StrataToast>(
      html`<strata-toast tone="danger">msg</strata-toast>`
    );
    expect(
      el.shadowRoot!.querySelector('.toast')!.getAttribute('role')
    ).to.equal('alert');
  });

  it('reflects each tone attribute', async () => {
    for (const tone of ['info', 'success', 'danger'] as const) {
      const el = await fixture<StrataToast>(
        html`<strata-toast tone=${tone}>msg</strata-toast>`
      );
      expect(el.getAttribute('tone')).to.equal(tone);
    }
  });

  it('dispatches strata-dismiss and removes itself on dismiss', async () => {
    const el = await fixture<StrataToast>(
      html`<strata-toast heading="Saved">msg</strata-toast>`
    );
    setTimeout(() =>
      el.shadowRoot!.querySelector<HTMLButtonElement>('.dismiss')!.click()
    );
    await oneEvent(el, 'strata-dismiss');
    expect(el.isConnected).to.be.false;
  });

  it('stays in the DOM when strata-dismiss is prevented', async () => {
    const el = await fixture<StrataToast>(
      html`<strata-toast heading="Saved">msg</strata-toast>`
    );
    el.addEventListener('strata-dismiss', (e) => e.preventDefault());
    el.shadowRoot!.querySelector<HTMLButtonElement>('.dismiss')!.click();
    expect(el.isConnected).to.be.true;
  });

  it('is accessible in all tones', async () => {
    for (const tone of ['info', 'success', 'danger'] as const) {
      const el = await fixture<StrataToast>(
        html`<strata-toast tone=${tone} heading="Heading">Message</strata-toast>`
      );
      // Let the entry animation finish so axe measures final colours,
      // not mid-fade blends.
      await Promise.all(
        el
          .shadowRoot!.querySelector('.toast')!
          .getAnimations()
          .map((a) => a.finished)
      );
      await expect(el).to.be.accessible();
    }
  });
});

describe('strata-toast-region', () => {
  it('is a labelled polite live region', async () => {
    const el = await fixture<StrataToastRegion>(html`
      <strata-toast-region>
        <strata-toast tone="success">Saved.</strata-toast>
      </strata-toast-region>
    `);
    expect(el.getAttribute('role')).to.equal('region');
    expect(el.getAttribute('aria-live')).to.equal('polite');
    expect(el.getAttribute('aria-label')).to.equal('Notifications');
  });

  it('stacks slotted toasts', async () => {
    const el = await fixture<StrataToastRegion>(html`
      <strata-toast-region>
        <strata-toast tone="success">One</strata-toast>
        <strata-toast tone="info">Two</strata-toast>
      </strata-toast-region>
    `);
    expect(el.querySelectorAll('strata-toast').length).to.equal(2);
    const cs = getComputedStyle(el);
    expect(cs.position).to.equal('fixed');
    expect(cs.flexDirection).to.equal('column');
  });

  it('is accessible', async () => {
    const el = await fixture<StrataToastRegion>(html`
      <strata-toast-region>
        <strata-toast tone="success" heading="Saved">Done.</strata-toast>
      </strata-toast-region>
    `);
    const toast = el.querySelector('strata-toast')!;
    await Promise.all(
      toast
        .shadowRoot!.querySelector('.toast')!
        .getAnimations()
        .map((a) => a.finished)
    );
    await expect(el).to.be.accessible();
  });
});
