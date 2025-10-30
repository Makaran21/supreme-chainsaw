/* eslint-disable @typescript-eslint/no-require-imports */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
      extend: {}
    },
    plugins: [require('@tailwindcss/container-queries')]
  };