import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './button.js';

const meta: Meta = {
  title: 'Components/Button',
  component: 'strata-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    variant: 'primary',
    disabled: false,
    loading: false,
    label: 'Button',
  },
  render: (args) => html`
    <strata-button
      variant=${args.variant}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      >${args.label}</strata-button
    >
  `,
};
export default meta;

type Story = StoryObj;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger', label: 'Delete' } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true, label: 'Saving…' } };

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
      <strata-button variant="primary">Primary</strata-button>
      <strata-button variant="secondary">Secondary</strata-button>
      <strata-button variant="ghost">Ghost</strata-button>
      <strata-button variant="danger">Danger</strata-button>
      <strata-button variant="primary" disabled>Disabled</strata-button>
      <strata-button variant="primary" loading>Loading</strata-button>
    </div>
  `,
};

export const KeyboardFocus: Story = {
  name: 'Keyboard focus ring',
  render: () => html`
    <p style="font:14px var(--strata-font-body);color:var(--strata-text-muted)">
      Tab through the buttons — each shows a two-layer focus ring
      (2px surface, 4px focus colour) only for keyboard focus.
    </p>
    <div style="display:flex;gap:12px">
      <strata-button variant="primary">First</strata-button>
      <strata-button variant="secondary">Second</strata-button>
      <strata-button variant="danger">Third</strata-button>
    </div>
  `,
};
