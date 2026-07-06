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
      border: var(--strata-border-width, 1px) solid var(--strata-border, #e4e4e7);
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
    th {
      text-align: left;
      padding: 11px var(--strata-space-4, 16px);
      background: transparent;
      border-bottom: var(--strata-border-width, 1px) solid var(--strata-border, #e4e4e7);
      color: var(--strata-text-muted, #71717a);
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
    }
    td {
      padding: 13px var(--strata-space-4, 16px);
      color: var(--strata-text, #09090b);
    }
    tbody tr {
      border-bottom: var(--strata-border-width, 1px) solid var(--strata-border, #e4e4e7);
      transition: background-color var(--strata-duration-fast, 150ms)
        var(--strata-easing-default, ease);
    }
    tbody tr:last-child {
      border-bottom: none;
    }
    tbody tr:hover {
      background: var(--strata-surface-hover, #f4f4f5);
    }
    th.align-right,
    td.align-right {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .empty {
      padding: var(--strata-space-6, 32px) var(--strata-space-4, 16px);
      text-align: center;
      color: var(--strata-text-muted, #71717a);
    }
    @media (prefers-reduced-motion: reduce) {
      tbody tr {
        transition: none;
      }
    }
  `;

  render() {
    return html`
      <table part="table">
        <thead part="header">
          <tr>
            ${this.columns.map(
              (col) => html`
                <th part="head" scope="col" class=${col.align === 'right' ? 'align-right' : ''}>
                  ${col.label}
                </th>
              `
            )}
          </tr>
        </thead>
        <tbody>
          ${this.rows.length === 0
            ? html`
                <tr part="row">
                  <td part="cell" class="empty" colspan=${Math.max(this.columns.length, 1)}>
                    ${this.emptyMessage}
                  </td>
                </tr>
              `
            : this.rows.map(
                (row) => html`
                  <tr part="row">
                    ${this.columns.map(
                      (col) => html`
                        <td part="cell" class=${col.align === 'right' ? 'align-right' : ''}>
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
