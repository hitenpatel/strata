import { fixture, expect, html } from '@open-wc/testing';
import './tooltip.js';
import type { StrataTooltip } from './tooltip.js';

describe('strata-tooltip', () => {
  it('renders the trigger and a role="tooltip" bubble with the text', async () => {
    const el = await fixture<StrataTooltip>(html`
      <strata-tooltip text="Copy API key">
        <button>Copy</button>
      </strata-tooltip>
    `);
    const tip = el.shadowRoot!.querySelector('[role="tooltip"]')!;
    expect(tip).to.exist;
    expect(tip.textContent).to.include('Copy API key');
  });

  it('links the trigger to a description via aria-describedby', async () => {
    const el = await fixture<StrataTooltip>(html`
      <strata-tooltip text="Copy API key">
        <button>Copy</button>
      </strata-tooltip>
    `);
    const trigger = el.querySelector('button')!;
    const descId = trigger.getAttribute('aria-describedby')!;
    expect(descId).to.exist;
    const desc = el.querySelector(`#${descId}`)!;
    expect(desc).to.exist;
    expect(desc.textContent).to.equal('Copy API key');
  });

  it('shows on focus-within and hides on Escape', async () => {
    const el = await fixture<StrataTooltip>(html`
      <strata-tooltip text="Copy API key">
        <button>Copy</button>
      </strata-tooltip>
    `);
    const tip = el.shadowRoot!.querySelector('[role="tooltip"]')!;
    expect(tip.classList.contains('open')).to.be.false;

    el.querySelector('button')!.focus();
    await el.updateComplete;
    expect(tip.classList.contains('open')).to.be.true;

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await el.updateComplete;
    expect(tip.classList.contains('open')).to.be.false;
  });

  it('shows on mouseenter and hides on mouseleave', async () => {
    const el = await fixture<StrataTooltip>(html`
      <strata-tooltip text="Copy API key">
        <button>Copy</button>
      </strata-tooltip>
    `);
    const tip = el.shadowRoot!.querySelector('[role="tooltip"]')!;

    el.dispatchEvent(new Event('mouseenter'));
    await el.updateComplete;
    expect(tip.classList.contains('open')).to.be.true;

    el.dispatchEvent(new Event('mouseleave'));
    await el.updateComplete;
    expect(tip.classList.contains('open')).to.be.false;
  });

  it('defaults to top placement and reflects bottom', async () => {
    const top = await fixture<StrataTooltip>(html`
      <strata-tooltip text="t"><button>x</button></strata-tooltip>
    `);
    expect(top.getAttribute('placement')).to.equal('top');

    const bottom = await fixture<StrataTooltip>(html`
      <strata-tooltip text="t" placement="bottom">
        <button>x</button>
      </strata-tooltip>
    `);
    expect(bottom.getAttribute('placement')).to.equal('bottom');
  });

  it('is accessible', async () => {
    const el = await fixture<StrataTooltip>(html`
      <strata-tooltip text="Copy API key">
        <button>Copy</button>
      </strata-tooltip>
    `);
    await expect(el).to.be.accessible();
  });
});
