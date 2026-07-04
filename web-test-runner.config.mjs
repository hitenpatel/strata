import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';
import { build } from 'esbuild';

// React ships CJS-only; prebundle it to ESM once so the browser can load it.
// splitting:true puts React itself in a shared chunk so both entries use the
// same instance.
const vendorDir = 'node_modules/.cache/wtr-vendor';
await build({
  entryPoints: { react: 'react', 'react-dom-client': 'react-dom/client' },
  bundle: true,
  format: 'esm',
  splitting: true,
  outdir: vendorDir,
  define: { 'process.env.NODE_ENV': '"development"' },
  logLevel: 'silent',
});

export default {
  files: 'src/**/*.test.ts',
  nodeResolve: true,
  testRunnerHtml: (testFramework) => `
    <html>
      <body>
        <script>window.process = { env: { NODE_ENV: 'development' } };</script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>`,
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            react: `/${vendorDir}/react.js`,
            'react-dom/client': `/${vendorDir}/react-dom-client.js`,
          },
        },
      },
    }),
    esbuildPlugin({
      ts: true,
      js: true,
      target: 'es2022',
      tsconfig: 'tsconfig.json',
      define: { 'process.env.NODE_ENV': '"development"' },
    }),
  ],
};
