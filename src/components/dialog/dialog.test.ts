import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import './dialog.js';
import type { StrataDialog } from './dialog.js';

describe('strata-dialog', () => {
  it('renders the heading and wires aria-labelledby', async () => {
    const el = await fixture<StrataDialog>(
      html`<strata-dialog heading="Delete workspace?">Body</strata-dialog>`
    );
    const dialog = el.shadowRoot!.querySelector('dialog')!;
    const h2 = el.shadowRoot!.querySelector('h2')!;
    expect(dialog.getAttribute('aria-labelledby')).to.equal(h2.id);
    expect(h2.textContent).to.equal('Delete workspace?');
  });

  it('is closed by default', async () => {
    const el = await fixture<StrataDialog>(html`<strata-dialog heading="X">Body</strata-dialog>`);
    expect(el.open).to.be.false;
    expect(el.shadowRoot!.querySelector('dialog')!.open).to.be.false;
  });

  it('shows the native dialog modally when open is set', async () => {
    const el = await fixture<StrataDialog>(html`<strata-dialog heading="X">Body</strata-dialog>`);
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('dialog')!.open).to.be.true;
    expect(el.hasAttribute('open')).to.be.true;
  });

  it('closes and emits a composed close event when the native dialog closes', async () => {
    const el = await fixture<StrataDialog>(html`<strata-dialog heading="X" open>Body</strata-dialog>`);
    await el.updateComplete;
    const listener = oneEvent(el, 'close');
    el.shadowRoot!.querySelector('dialog')!.close();
    const event = await listener;
    expect(event.composed).to.be.true;
    expect(el.open).to.be.false;
  });

  it('emits close when the open property is cleared programmatically', async () => {
    const el = await fixture<StrataDialog>(html`<strata-dialog heading="X" open>Body</strata-dialog>`);
    await el.updateComplete;
    const listener = oneEvent(el, 'close');
    el.open = false;
    await listener;
    expect(el.shadowRoot!.querySelector('dialog')!.open).to.be.false;
  });

  it('renders default and footer slot content', async () => {
    const el = await fixture<StrataDialog>(html`
      <strata-dialog heading="X" open>
        Body text
        <button slot="footer">Cancel</button>
      </strata-dialog>
    `);
    const footerSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="footer"]')!;
    expect(footerSlot.assignedElements()).to.have.length(1);
  });

  it('is accessible while open', async () => {
    const el = await fixture<StrataDialog>(html`
      <strata-dialog heading="Delete workspace?">
        This action cannot be undone.
        <button slot="footer">Cancel</button>
      </strata-dialog>
    `);
    el.open = true;
    await el.updateComplete;
    // Let the entry animation finish so axe measures the settled colours.
    const dialog = el.shadowRoot!.querySelector('dialog')!;
    await Promise.all(dialog.getAnimations({ subtree: true }).map((a) => a.finished));
    await expect(el).to.be.accessible();
  });
});
