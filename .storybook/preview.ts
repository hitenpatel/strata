import type { Preview } from '@storybook/web-components';
import '../src/generated/tokens.css';
import '../themes/sediment.css';

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
    skin: {
      description: 'Example skin (pure CSS retheme)',
      toolbar: {
        title: 'Skin',
        icon: 'beaker',
        items: [
          { value: 'none', title: 'Baseline' },
          { value: 'sediment', title: 'Sediment' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    variant: 'neutral',
    skin: 'none',
  },
  decorators: [
    (story, context) => {
      const { theme, variant, skin } = context.globals;
      const root = document.documentElement;
      if (theme === 'dark') root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      if (variant === 'showcase') root.setAttribute('data-variant', 'showcase');
      else root.removeAttribute('data-variant');
      if (skin && skin !== 'none') root.setAttribute('data-strata-skin', skin);
      else root.removeAttribute('data-strata-skin');
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
