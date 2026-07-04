import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './skeleton.js';

const meta: Meta = {
  title: 'Components/Skeleton',
  component: 'strata-skeleton',
  argTypes: {
    variant: { control: 'select', options: ['text', 'circle', 'rect'] },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    variant: 'text',
    width: '240px',
    height: '',
  },
  render: (args) => html`
    <strata-skeleton
      variant=${args.variant}
      width=${args.width}
      height=${args.height}
    ></strata-skeleton>
  `,
};
export default meta;

type Story = StoryObj;

export const Text: Story = {};
export const Circle: Story = { args: { variant: 'circle', width: '' } };
export const Rect: Story = { args: { variant: 'rect', width: '320px' } };

export const CardPlaceholder: Story = {
  render: () => html`
    <div
      aria-busy="true"
      style="padding:24px;background:var(--strata-surface);border:1px solid var(--strata-border);border-radius:var(--strata-radius-lg);display:flex;gap:16px;align-items:center;max-width:420px"
    >
      <strata-skeleton variant="circle"></strata-skeleton>
      <div style="flex:1;display:flex;flex-direction:column;gap:10px">
        <strata-skeleton variant="text" width="60%"></strata-skeleton>
        <strata-skeleton variant="text" width="90%"></strata-skeleton>
        <strata-skeleton variant="text" width="40%"></strata-skeleton>
      </div>
    </div>
  `,
};
