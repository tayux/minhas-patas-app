import { T, FONT_BODY } from '../src/theme.js';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    backgrounds: {
      default: 'warm',
      values: [
        { name: 'warm',    value: T.bgWash },
        { name: 'surface', value: T.surface },
        { name: 'dark',    value: '#0F0B1A' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: 'todo' },
  },
  decorators: [
    (Story) => (
      <div style={{ fontFamily: FONT_BODY, color: T.ink, minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
