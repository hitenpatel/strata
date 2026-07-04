import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './input.js';

const meta: Meta = {
  title: 'Components/Input',
  component: 'strata-input',
  argTypes: {
    label: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search'] },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    hint: { control: 'text' },
  },
  args: {
    label: 'Email',
    type: 'email',
    value: '',
    placeholder: 'you@company.com',
    disabled: false,
    required: false,
    error: '',
    hint: '',
  },
  render: (args) => html`
    <strata-input
      style="max-width:320px"
      label=${args.label}
      type=${args.type}
      value=${args.value}
      placeholder=${args.placeholder}
      ?disabled=${args.disabled}
      ?required=${args.required}
      error=${args.error}
      hint=${args.hint}
    ></strata-input>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
export const Filled: Story = { args: { value: 'aurora@noctal.studio' } };
export const WithHint: Story = {
  args: { hint: 'We only use this for account recovery.' },
};
export const Error: Story = {
  args: { value: 'not-an-email', error: 'Enter a valid email address' },
};
export const Disabled: Story = { args: { value: 'Locked value', disabled: true } };
export const Required: Story = { args: { required: true } };

export const AllStates: Story = {
  render: () => html`
    <div style="display:grid;gap:20px;max-width:320px">
      <strata-input label="Default" placeholder="you@company.com"></strata-input>
      <strata-input label="Filled" value="aurora@noctal.studio"></strata-input>
      <strata-input
        label="Error"
        value="not-an-email"
        error="Enter a valid email address"
      ></strata-input>
      <strata-input label="Hint" hint="Use your work address."></strata-input>
      <strata-input label="Disabled" value="Locked value" disabled></strata-input>
    </div>
  `,
};
