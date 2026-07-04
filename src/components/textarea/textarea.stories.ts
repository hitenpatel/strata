import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './textarea.js';

const meta: Meta = {
  title: 'Components/Textarea',
  component: 'strata-textarea',
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    hint: { control: 'text' },
  },
  args: {
    label: 'Description',
    value: '',
    placeholder: 'What are you working on?',
    rows: 4,
    disabled: false,
    required: false,
    error: '',
    hint: '',
  },
  render: (args) => html`
    <strata-textarea
      style="max-width:420px"
      label=${args.label}
      value=${args.value}
      placeholder=${args.placeholder}
      rows=${args.rows}
      ?disabled=${args.disabled}
      ?required=${args.required}
      error=${args.error}
      hint=${args.hint}
    ></strata-textarea>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
export const Filled: Story = {
  args: { value: 'Rewriting the onboarding flow to cut steps from five to three.' },
};
export const WithHint: Story = { args: { hint: 'Markdown is supported.' } };
export const Error: Story = { args: { error: 'A description is required' } };
export const Disabled: Story = { args: { value: 'Locked value', disabled: true } };

export const AllStates: Story = {
  render: () => html`
    <div style="display:grid;gap:20px;max-width:420px">
      <strata-textarea label="Default" placeholder="What are you working on?"></strata-textarea>
      <strata-textarea label="Error" error="A description is required"></strata-textarea>
      <strata-textarea label="Disabled" value="Locked value" disabled></strata-textarea>
    </div>
  `,
};
