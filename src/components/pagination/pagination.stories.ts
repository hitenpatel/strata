import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './pagination.js';

const meta: Meta = {
  title: 'Components/Pagination',
  component: 'strata-pagination',
  argTypes: {
    page: { control: { type: 'number', min: 1 } },
    total: { control: { type: 'number', min: 1 } },
  },
  args: {
    page: 1,
    total: 15,
  },
  render: (args) => html`
    <strata-pagination
      page=${args.page}
      total=${args.total}
      @page-change=${(e: CustomEvent<{ page: number }>) =>
        console.log('page-change:', e.detail.page)}
    ></strata-pagination>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
export const MiddlePage: Story = { args: { page: 8, total: 15 } };
export const LastPage: Story = { args: { page: 15, total: 15 } };
export const FewPages: Story = { args: { page: 2, total: 5 } };

export const WithSummary: Story = {
  name: 'With result summary',
  render: () => html`
    <div
      style="display:flex;align-items:center;justify-content:space-between;gap:16px;
             flex-wrap:wrap;padding:24px 28px;background:var(--strata-surface);
             border:1px solid var(--strata-border);border-radius:var(--strata-radius-lg)"
    >
      <span style="font:13.5px var(--strata-font-body);color:var(--strata-text-muted)">
        Showing <strong style="color:var(--strata-text)">1–10</strong> of 148
      </span>
      <strata-pagination page="1" total="15"></strata-pagination>
    </div>
  `,
};
