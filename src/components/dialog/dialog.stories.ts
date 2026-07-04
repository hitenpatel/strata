import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './dialog.js';
import '../button/button.js';
import type { StrataDialog } from './dialog.js';

const meta: Meta = {
  title: 'Components/Dialog',
  component: 'strata-dialog',
  argTypes: {
    heading: { control: 'text' },
    open: { control: 'boolean' },
  },
  args: {
    heading: 'Delete workspace?',
    open: false,
  },
};
export default meta;

type Story = StoryObj;

export const Interactive: Story = {
  name: 'Open / close via button',
  render: (args) => html`
    <strata-button
      variant="danger"
      @click=${(e: Event) => {
        const host = (e.target as HTMLElement).parentElement!;
        host.querySelector<StrataDialog>('strata-dialog')!.open = true;
      }}
      >Delete workspace…</strata-button
    >
    <strata-dialog heading=${args.heading}>
      This will permanently remove the workspace, its members and all associated
      data. This action cannot be undone.
      <strata-button
        slot="footer"
        variant="secondary"
        @click=${(e: Event) =>
          ((e.target as HTMLElement).closest('strata-dialog') as StrataDialog).open = false}
        >Cancel</strata-button
      >
      <strata-button
        slot="footer"
        variant="danger"
        @click=${(e: Event) =>
          ((e.target as HTMLElement).closest('strata-dialog') as StrataDialog).open = false}
        >Delete workspace</strata-button
      >
    </strata-dialog>
  `,
};

export const OpenByDefault: Story = {
  args: { open: true },
  render: (args) => html`
    <strata-dialog heading=${args.heading} ?open=${args.open}>
      Focus moves into the dialog on open, is trapped inside (native
      <code>showModal()</code>), and <kbd>Esc</kbd> closes it.
      <strata-button slot="footer" variant="secondary">Cancel</strata-button>
      <strata-button slot="footer" variant="primary">Confirm</strata-button>
    </strata-dialog>
  `,
};
