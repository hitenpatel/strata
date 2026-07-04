import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './table.js';
import type { StrataTableColumn } from './table.js';

const columns: StrataTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'mrr', label: 'MRR', align: 'right' },
];

const rows = [
  { name: 'Aurora Kwon', role: 'Owner', status: 'Active', mrr: '£480' },
  { name: 'Marcus Webb', role: 'Editor', status: 'Active', mrr: '£120' },
  { name: 'Ines Ferreira', role: 'Viewer', status: 'Invited', mrr: '£0' },
  { name: 'Dev Chandra', role: 'Editor', status: 'Active', mrr: '£240' },
];

const meta: Meta = {
  title: 'Components/Table',
  component: 'strata-table',
  render: () => html`<strata-table .columns=${columns} .rows=${rows}></strata-table>`,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};

export const Empty: Story = {
  render: () => html`
    <strata-table
      .columns=${columns}
      .rows=${[]}
      empty-message="No members yet — invite someone to get started."
    ></strata-table>
  `,
};

export const TwoColumns: Story = {
  render: () => html`
    <strata-table
      .columns=${[
        { key: 'setting', label: 'Setting' },
        { key: 'value', label: 'Value', align: 'right' },
      ] satisfies StrataTableColumn[]}
      .rows=${[
        { setting: 'Region', value: 'eu-west-2' },
        { setting: 'Retention', value: '90 days' },
        { setting: 'Encryption', value: 'AES-256' },
      ]}
    ></strata-table>
  `,
};
