import type { Preview } from '@storybook/web-components';
import '../src/generated/tokens.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    variant: {
      description: 'Accent variant',
      toolbar: {
        title: 'Accent',
        icon: 'paintbrush',
        items: [
          { value: 'neutral', title: 'Neutral (blue)' },
          { value: 'showcase', title: 'Showcase (violet)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    variant: 'neutral',
  },
  decorators: [
    (story, context) => {
      const { theme, variant } = context.globals;
      const root = document.documentElement;
      if (theme === 'dark') root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      if (variant === 'showcase') root.setAttribute('data-variant', 'showcase');
      else root.removeAttribute('data-variant');
      document.body.style.background = 'var(--strata-canvas)';
      return story();
    },
  ],
  parameters: {
    backgrounds: { disable: true },
    controls: { expanded: true },
  },
};
export default preview;
