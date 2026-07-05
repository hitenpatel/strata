import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface StrataTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
}

@customElement('strata-table')
export class StrataTable extends LitElement {
  @property({ attribute: false }) columns: StrataTableColumn[] = [];
  @property({ attribute: false }) rows: Record<string, unknown>[] = [];
  @property({ attribute: 'empty-message' }) emptyMessage = 'No data to display';

  static styles = css`
    :host {
      display: block;
      background: var(--strata-surface, #fff);
      border: 1px solid var(--strata-border, #e7e1d8);
      border-radius: var(--strata-radius-lg, 8px);
      overflow: hidden;
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    :host([hidden]) {
      display: none;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    /* Sediment: the header row is a lower stratum — sunken fill, overline type */
    th {
      text-align: left;
      padding: 11px var(--strata-space-4, 16px);
      background: var(--strata-surface-sunken, #f3efe9);
      border-bottom: 1px solid var(--strata-border, #e7e1d8);
      color: var(--strata-text-muted, #6a6153);
      font-size: 12.5px;
      font-weight: 600;
      letter-spacing: 0.01em;
      white-space: nowrap;
    }
    td {
      padding: 13px var(--strata-space-4, 16px);
      color: var(--strata-text, #231f1a);
    }
    tbody tr {
      border-bottom: 1px solid var(--strata-border, #e7e1d8);
      transition: background-color var(--strata-duration-fast, 120ms)
        var(--strata-easing-drop, ease);
    }
    tbody tr:last-child {
      border-bottom: none;
    }
    tbody tr:hover {
      background: var(--strata-surface-hover, #faf8f5);
    }
    th.align-right,
    td.align-right {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .empty {
      padding: var(--strata-space-6, 32px) var(--strata-space-4, 16px);
      text-align: center;
      color: var(--strata-text-muted, #6a6153);
    }
    @media (prefers-reduced-motion: reduce) {
      tbody tr {
        transition: none;
      }
    }
  `;

  render() {
    return html`
      <table>
        <thead>
          <tr>
            ${this.columns.map(
              (col) => html`
                <th scope="col" class=${col.align === 'right' ? 'align-right' : ''}>
                  ${col.label}
                </th>
              `
            )}
          </tr>
        </thead>
        <tbody>
          ${this.rows.length === 0
            ? html`
                <tr>
                  <td class="empty" colspan=${Math.max(this.columns.length, 1)}>
                    ${this.emptyMessage}
                  </td>
                </tr>
              `
            : this.rows.map(
                (row) => html`
                  <tr>
                    ${this.columns.map(
                      (col) => html`
                        <td class=${col.align === 'right' ? 'align-right' : ''}>
                          ${row[col.key] as string}
                        </td>
                      `
                    )}
                  </tr>
                `
              )}
        </tbody>
      </table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-table': StrataTable;
  }
}
