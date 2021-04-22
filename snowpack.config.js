// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  optimize: {
    entrypoints: [
      './src/background.ts',
      './src/Options.tsx',
      './src/Popup.tsx'
    ],
    bundle: true,
    sourcemap: false,
    minify: true
  },
  alias: {
    '@': './src'
  },
  mount: {
    public: '/',
    src: '/dist'
  },
  plugins: [
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-postcss',
    '@jadex/snowpack-plugin-tailwindcss-jit'
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    metaUrlPath: 'snowpack'
  }
}
