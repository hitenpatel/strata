import { fixture, expect, html, oneEvent, nextFrame } from '@open-wc/testing';
import './menu.js';
import type { StrataMenu, StrataMenuItem } from './menu.js';

async function menuFixture(): Promise<StrataMenu> {
  const el = await fixture<StrataMenu>(html`
    <strata-menu>
      <button slot="trigger">Actions</button>
      <strata-menu-item value="rename">Rename</strata-menu-item>
      <strata-menu-item value="duplicate">Duplicate</strata-menu-item>
      <strata-menu-item value="delete" danger>Delete</strata-menu-item>
    </strata-menu>
  `);
  await el.updateComplete;
  return el;
}

const getItems = (el: StrataMenu): StrataMenuItem[] =>
  Array.from(el.querySelectorAll<StrataMenuItem>('strata-menu-item'));
const getTrigger = (el: StrataMenu): HTMLButtonElement =>
  el.querySelector('button[slot="trigger"]')!;
const getPopup = (el: StrataMenu): HTMLElement =>
  el.shadowRoot!.querySelector<HTMLElement>('.popup')!;

describe('strata-menu', () => {
  it('wires aria-haspopup and aria-expanded on the slotted trigger', async () => {
    const el = await menuFixture();
    const trigger = getTrigger(el);
    expect(trigger.getAttribute('aria-haspopup')).to.equal('menu');
    expect(trigger.getAttribute('aria-expanded')).to.equal('false');
  });

  it('assigns menu roles', async () => {
    const el = await menuFixture();
    expect(getPopup(el).getAttribute('role')).to.equal('menu');
    getItems(el).forEach((item) => expect(item.getAttribute('role')).to.equal('menuitem'));
  });

  it('opens on trigger click and focuses the first item', async () => {
    const el = await menuFixture();
    getTrigger(el).click();
    await el.updateComplete;
    await nextFrame();
    expect(el.open).to.be.true;
    expect(getTrigger(el).getAttribute('aria-expanded')).to.equal('true');
    expect(document.activeElement).to.equal(getItems(el)[0]);
  });

  it('opens with ArrowDown (first item) and ArrowUp (last item)', async () => {
    const el = await menuFixture();
    const trigger = getTrigger(el);
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true })
    );
    await el.updateComplete;
    await nextFrame();
    expect(el.open).to.be.true;
    expect(document.activeElement).to.equal(getItems(el)[0]);

    el.open = false;
    await el.updateComplete;
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, composed: true })
    );
    await el.updateComplete;
    await nextFrame();
    expect(document.activeElement).to.equal(getItems(el)[2]);
  });

  it('moves focus between items with arrow keys, wrapping', async () => {
    const el = await menuFixture();
    getTrigger(el).click();
    await el.updateComplete;
    await nextFrame();
    const items = getItems(el);
    const press = (key: string) =>
      (document.activeElement as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, composed: true })
      );

    press('ArrowDown');
    expect(document.activeElement).to.equal(items[1]);
    press('ArrowDown');
    expect(document.activeElement).to.equal(items[2]);
    press('ArrowDown'); // wraps
    expect(document.activeElement).to.equal(items[0]);
    press('ArrowUp'); // wraps back
    expect(document.activeElement).to.equal(items[2]);
    press('Home');
    expect(document.activeElement).to.equal(items[0]);
    press('End');
    expect(document.activeElement).to.equal(items[2]);
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const el = await menuFixture();
    getTrigger(el).click();
    await el.updateComplete;
    await nextFrame();
    getItems(el)[0]!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true })
    );
    await el.updateComplete;
    expect(el.open).to.be.false;
    expect(document.activeElement).to.equal(getTrigger(el));
  });

  it('emits select with the item value on click, then closes', async () => {
    const el = await menuFixture();
    getTrigger(el).click();
    await el.updateComplete;
    const listener = oneEvent(el, 'select');
    getItems(el)[1]!.click();
    const event = (await listener) as CustomEvent<{ value: string }>;
    expect(event.detail.value).to.equal('duplicate');
    expect(el.open).to.be.false;
  });

  it('closes on outside pointerdown', async () => {
    const el = await menuFixture();
    getTrigger(el).click();
    await el.updateComplete;
    expect(el.open).to.be.true;
    document.body.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, composed: true })
    );
    await el.updateComplete;
    expect(el.open).to.be.false;
  });

  it('is accessible while open', async () => {
    const el = await menuFixture();
    getTrigger(el).click();
    await el.updateComplete;
    // wait out the open animation so axe measures settled opacity
    const popup = el.shadowRoot!.querySelector('.popup');
    await Promise.all(
      (popup?.getAnimations({ subtree: true }) ?? []).map((a) => a.finished)
    );
    await nextFrame();
    await expect(el).to.be.accessible();
  });
});
