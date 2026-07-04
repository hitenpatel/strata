import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import './pagination.js';
import type { StrataPagination } from './pagination.js';

const getNumberButtons = (el: StrataPagination): HTMLButtonElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>('button:not(.arrow)'));
const getPrev = (el: StrataPagination): HTMLButtonElement =>
  el.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-label="Previous page"]')!;
const getNext = (el: StrataPagination): HTMLButtonElement =>
  el.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-label="Next page"]')!;

describe('strata-pagination', () => {
  it('renders a nav labelled Pagination', async () => {
    const el = await fixture<StrataPagination>(
      html`<strata-pagination page="1" total="5"></strata-pagination>`
    );
    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).to.equal(
      'Pagination'
    );
  });

  it('renders every page when the range is short', async () => {
    const el = await fixture<StrataPagination>(
      html`<strata-pagination page="2" total="5"></strata-pagination>`
    );
    const labels = getNumberButtons(el).map((b) => b.textContent!.trim());
    expect(labels).to.deep.equal(['1', '2', '3', '4', '5']);
    expect(el.shadowRoot!.querySelector('.ellipsis')).to.not.exist;
  });

  it('collapses long ranges with an ellipsis', async () => {
    const el = await fixture<StrataPagination>(
      html`<strata-pagination page="1" total="15"></strata-pagination>`
    );
    const labels = getNumberButtons(el).map((b) => b.textContent!.trim());
    expect(labels).to.deep.equal(['1', '2', '15']);
    expect(el.shadowRoot!.querySelectorAll('.ellipsis')).to.have.length(1);
  });

  it('shows an ellipsis either side of a middle page', async () => {
    const el = await fixture<StrataPagination>(
      html`<strata-pagination page="8" total="15"></strata-pagination>`
    );
    const labels = getNumberButtons(el).map((b) => b.textContent!.trim());
    expect(labels).to.deep.equal(['1', '7', '8', '9', '15']);
    expect(el.shadowRoot!.querySelectorAll('.ellipsis')).to.have.length(2);
  });

  it('marks the current page with aria-current="page"', async () => {
    const el = await fixture<StrataPagination>(
      html`<strata-pagination page="2" total="5"></strata-pagination>`
    );
    const current = el.shadowRoot!.querySelector('button[aria-current="page"]')!;
    expect(current.textContent!.trim()).to.equal('2');
  });

  it('disables prev on the first page and next on the last', async () => {
    const first = await fixture<StrataPagination>(
      html`<strata-pagination page="1" total="5"></strata-pagination>`
    );
    expect(getPrev(first).disabled).to.be.true;
    expect(getNext(first).disabled).to.be.false;

    const last = await fixture<StrataPagination>(
      html`<strata-pagination page="5" total="5"></strata-pagination>`
    );
    expect(getPrev(last).disabled).to.be.false;
    expect(getNext(last).disabled).to.be.true;
  });

  it('emits page-change when a page number is clicked', async () => {
    const el = await fixture<StrataPagination>(
      html`<strata-pagination page="1" total="5"></strata-pagination>`
    );
    const listener = oneEvent(el, 'page-change');
    getNumberButtons(el)[2]!.click();
    const event = (await listener) as CustomEvent<{ page: number }>;
    expect(event.detail.page).to.equal(3);
    expect(el.page).to.equal(3);
  });

  it('emits page-change for prev/next and does not go out of range', async () => {
    const el = await fixture<StrataPagination>(
      html`<strata-pagination page="2" total="5"></strata-pagination>`
    );
    const listener = oneEvent(el, 'page-change');
    getNext(el).click();
    const event = (await listener) as CustomEvent<{ page: number }>;
    expect(event.detail.page).to.equal(3);

    el.page = 5;
    await el.updateComplete;
    let fired = false;
    el.addEventListener('page-change', () => (fired = true));
    getNext(el).click();
    expect(fired).to.be.false;
    expect(el.page).to.equal(5);
  });

  it('does not emit when clicking the current page', async () => {
    const el = await fixture<StrataPagination>(
      html`<strata-pagination page="2" total="5"></strata-pagination>`
    );
    let fired = false;
    el.addEventListener('page-change', () => (fired = true));
    el.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-current="page"]')!.click();
    expect(fired).to.be.false;
  });

  it('is accessible', async () => {
    const el = await fixture<StrataPagination>(
      html`<strata-pagination page="8" total="15"></strata-pagination>`
    );
    await expect(el).to.be.accessible();
  });
});
