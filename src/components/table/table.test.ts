import { fixture, expect, html } from '@open-wc/testing';
import './table.js';
import type { StrataTable, StrataTableColumn } from './table.js';

const columns: StrataTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'mrr', label: 'MRR', align: 'right' },
];

const rows = [
  { name: 'Aurora Kwon', role: 'Owner', mrr: '£480' },
  { name: 'Marcus Webb', role: 'Editor', mrr: '£120' },
];

describe('strata-table', () => {
  it('renders column headers with scope="col"', async () => {
    const el = await fixture<StrataTable>(
      html`<strata-table .columns=${columns} .rows=${rows}></strata-table>`
    );
    const ths = Array.from(el.shadowRoot!.querySelectorAll('th'));
    expect(ths).to.have.length(3);
    ths.forEach((th) => expect(th.getAttribute('scope')).to.equal('col'));
    expect(ths.map((th) => th.textContent!.trim())).to.deep.equal(['Name', 'Role', 'MRR']);
  });

  it('renders one row per entry with cell values keyed by column', async () => {
    const el = await fixture<StrataTable>(
      html`<strata-table .columns=${columns} .rows=${rows}></strata-table>`
    );
    const bodyRows = Array.from(el.shadowRoot!.querySelectorAll('tbody tr'));
    expect(bodyRows).to.have.length(2);
    const firstCells = Array.from(bodyRows[0]!.querySelectorAll('td')).map((td) =>
      td.textContent!.trim()
    );
    expect(firstCells).to.deep.equal(['Aurora Kwon', 'Owner', '£480']);
  });

  it('right-aligns columns marked align: right', async () => {
    const el = await fixture<StrataTable>(
      html`<strata-table .columns=${columns} .rows=${rows}></strata-table>`
    );
    const mrrTh = el.shadowRoot!.querySelectorAll('th')[2]!;
    expect(mrrTh.classList.contains('align-right')).to.be.true;
  });

  it('shows the empty message when there are no rows', async () => {
    const el = await fixture<StrataTable>(
      html`<strata-table .columns=${columns} .rows=${[]}></strata-table>`
    );
    const empty = el.shadowRoot!.querySelector('td.empty')!;
    expect(empty.textContent!.trim()).to.equal('No data to display');
    expect(empty.getAttribute('colspan')).to.equal('3');
  });

  it('supports a custom empty message via attribute', async () => {
    const el = await fixture<StrataTable>(
      html`<strata-table
        .columns=${columns}
        .rows=${[]}
        empty-message="Nothing here"
      ></strata-table>`
    );
    expect(el.shadowRoot!.querySelector('td.empty')!.textContent!.trim()).to.equal(
      'Nothing here'
    );
  });

  it('is accessible with data and when empty', async () => {
    const withData = await fixture<StrataTable>(
      html`<strata-table .columns=${columns} .rows=${rows}></strata-table>`
    );
    await expect(withData).to.be.accessible();

    const empty = await fixture<StrataTable>(
      html`<strata-table .columns=${columns} .rows=${[]}></strata-table>`
    );
    await expect(empty).to.be.accessible();
  });
});
