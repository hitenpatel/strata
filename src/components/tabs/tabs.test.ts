import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import './tabs.js';
import type { StrataTabs, StrataTab, StrataTabPanel } from './tabs.js';

async function tabsFixture(): Promise<StrataTabs> {
  const el = await fixture<StrataTabs>(html`
    <strata-tabs>
      <strata-tab slot="tab">Account</strata-tab>
      <strata-tab slot="tab">Billing</strata-tab>
      <strata-tab slot="tab">Team</strata-tab>
      <strata-tab-panel>Account panel</strata-tab-panel>
      <strata-tab-panel>Billing panel</strata-tab-panel>
      <strata-tab-panel>Team panel</strata-tab-panel>
    </strata-tabs>
  `);
  await el.updateComplete;
  return el;
}

const getTabs = (el: StrataTabs): StrataTab[] =>
  Array.from(el.querySelectorAll<StrataTab>('strata-tab'));
const getPanels = (el: StrataTabs): StrataTabPanel[] =>
  Array.from(el.querySelectorAll<StrataTabPanel>('strata-tab-panel'));

describe('strata-tabs', () => {
  it('assigns ARIA roles per the APG tabs pattern', async () => {
    const el = await tabsFixture();
    expect(el.shadowRoot!.querySelector('[role="tablist"]')).to.exist;
    getTabs(el).forEach((tab) => expect(tab.getAttribute('role')).to.equal('tab'));
    getPanels(el).forEach((panel) => expect(panel.getAttribute('role')).to.equal('tabpanel'));
  });

  it('selects the first tab by default and hides other panels', async () => {
    const el = await tabsFixture();
    const tabs = getTabs(el);
    const panels = getPanels(el);
    expect(tabs[0]!.selected).to.be.true;
    expect(tabs[0]!.getAttribute('aria-selected')).to.equal('true');
    expect(tabs[1]!.getAttribute('aria-selected')).to.equal('false');
    expect(panels[0]!.hidden).to.be.false;
    expect(panels[1]!.hidden).to.be.true;
    expect(panels[2]!.hidden).to.be.true;
  });

  it('wires aria-controls and aria-labelledby between tabs and panels', async () => {
    const el = await tabsFixture();
    const tabs = getTabs(el);
    const panels = getPanels(el);
    tabs.forEach((tab, i) => {
      expect(tab.getAttribute('aria-controls')).to.equal(panels[i]!.id);
      expect(panels[i]!.getAttribute('aria-labelledby')).to.equal(tab.id);
    });
  });

  it('uses a roving tabindex — only the selected tab is a tab stop', async () => {
    const el = await tabsFixture();
    const tabs = getTabs(el);
    expect(tabs[0]!.tabIndex).to.equal(0);
    expect(tabs[1]!.tabIndex).to.equal(-1);
    expect(tabs[2]!.tabIndex).to.equal(-1);
  });

  it('switches tabs on click and emits change', async () => {
    const el = await tabsFixture();
    const tabs = getTabs(el);
    const listener = oneEvent(el, 'change');
    tabs[1]!.click();
    const event = (await listener) as CustomEvent<{ index: number }>;
    expect(event.detail.index).to.equal(1);
    expect(el.selected).to.equal(1);
    expect(getPanels(el)[1]!.hidden).to.be.false;
    expect(getPanels(el)[0]!.hidden).to.be.true;
  });

  it('moves selection and focus with arrow keys, wrapping at the ends', async () => {
    const el = await tabsFixture();
    const tabs = getTabs(el);
    const press = (key: string) =>
      tabs[el.selected]!.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, composed: true })
      );

    press('ArrowRight');
    expect(el.selected).to.equal(1);
    expect(document.activeElement).to.equal(tabs[1]);

    press('ArrowLeft');
    expect(el.selected).to.equal(0);

    press('ArrowLeft'); // wraps to last
    expect(el.selected).to.equal(2);

    press('ArrowRight'); // wraps to first
    expect(el.selected).to.equal(0);
  });

  it('supports Home and End keys', async () => {
    const el = await tabsFixture();
    const tabs = getTabs(el);
    tabs[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, composed: true }));
    expect(el.selected).to.equal(2);
    tabs[2]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, composed: true }));
    expect(el.selected).to.equal(0);
  });

  it('is accessible', async () => {
    const el = await tabsFixture();
    await expect(el).to.be.accessible();
  });
});
