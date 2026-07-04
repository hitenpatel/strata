import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './avatar.js';

const meta: Meta = {
  title: 'Components/Avatar',
  component: 'strata-avatar',
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    name: { control: 'text' },
    src: { control: 'text' },
  },
  args: {
    size: 'md',
    name: 'Amara Khan',
    src: '',
  },
  render: (args) => html`
    <strata-avatar size=${args.size} name=${args.name} src=${args.src}>
    </strata-avatar>
  `,
};
export default meta;

type Story = StoryObj;

export const Initials: Story = {};
export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/80?img=5',
    name: 'Dana Reyes',
  },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:16px;align-items:center">
      <strata-avatar size="sm" name="Amara Khan"></strata-avatar>
      <strata-avatar size="md" name="Dana Reyes"></strata-avatar>
      <strata-avatar size="lg" name="Miles Fox"></strata-avatar>
    </div>
  `,
};
