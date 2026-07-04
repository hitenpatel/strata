import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './icon-button.js';

const gearIcon = html`<svg
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <circle cx="12" cy="12" r="3"></circle>
  <path
    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
  ></path>
</svg>`;

const plusIcon = html`<svg
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2.2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <line x1="12" y1="5" x2="12" y2="19"></line>
  <line x1="5" y1="12" x2="19" y2="12"></line>
</svg>`;

const binIcon = html`<svg
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <polyline points="3 6 5 6 21 6"></polyline>
  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
</svg>`;

const meta: Meta = {
  title: 'Components/Icon Button',
  component: 'strata-icon-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    variant: 'secondary',
    disabled: false,
    label: 'Settings',
  },
  render: (args) => html`
    <strata-icon-button variant=${args.variant} ?disabled=${args.disabled} label=${args.label}
      >${gearIcon}</strata-icon-button
    >
  `,
};
export default meta;

type Story = StoryObj;

export const Secondary: Story = {};
export const Primary: Story = {
  args: { variant: 'primary', label: 'Add' },
  render: (args) => html`
    <strata-icon-button variant=${args.variant} ?disabled=${args.disabled} label=${args.label}
      >${plusIcon}</strata-icon-button
    >
  `,
};
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = {
  args: { variant: 'danger', label: 'Delete' },
  render: (args) => html`
    <strata-icon-button variant=${args.variant} ?disabled=${args.disabled} label=${args.label}
      >${binIcon}</strata-icon-button
    >
  `,
};
export const Disabled: Story = { args: { disabled: true } };

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
      <strata-icon-button variant="primary" label="Add">${plusIcon}</strata-icon-button>
      <strata-icon-button variant="secondary" label="Settings">${gearIcon}</strata-icon-button>
      <strata-icon-button variant="ghost" label="Settings">${gearIcon}</strata-icon-button>
      <strata-icon-button variant="danger" label="Delete">${binIcon}</strata-icon-button>
      <strata-icon-button variant="secondary" label="Delete" disabled>${binIcon}</strata-icon-button>
    </div>
  `,
};
