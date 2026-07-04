import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './select.js';

const roleOptions = [
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
  { value: 'viewer', label: 'Viewer' },
];

const meta: Meta = {
  title: 'Components/Select',
  component: 'strata-select',
  argTypes: {
    label: { control: 'text' },
    value: { control: 'select', options: ['editor', 'admin', 'viewer'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    hint: { control: 'text' },
  },
  args: {
    label: 'Role',
    value: 'editor',
    disabled: false,
    required: false,
    error: '',
    hint: '',
  },
  render: (args) => html`
    <strata-select
      style="max-width:210px"
      label=${args.label}
      .options=${roleOptions}
      value=${args.value}
      ?disabled=${args.disabled}
      ?required=${args.required}
      error=${args.error}
      hint=${args.hint}
    ></strata-select>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'Admins can invite members.' } };
export const Error: Story = { args: { error: 'Choose a role' } };
export const Disabled: Story = { args: { disabled: true } };

export const AllStates: Story = {
  render: () => html`
    <div style="display:grid;gap:20px;max-width:210px">
      <strata-select label="Default" .options=${roleOptions} value="editor"></strata-select>
      <strata-select
        label="Error"
        .options=${roleOptions}
        value="editor"
        error="Choose a role"
      ></strata-select>
      <strata-select label="Disabled" .options=${roleOptions} value="editor" disabled></strata-select>
    </div>
  `,
};
