import * as esbuild from 'esbuild';

const options = {
  format: 'esm',
  bundle: true,
  platform: 'node',
  packages: 'external',
  sourcemap: false,
  minify: false,
};

await esbuild.build({
  entryPoints: ['src/cdk-workshop.ts'],
  outdir: 'dist',
  ...options,
});

await esbuild.build({
  entryPoints: ['src/lambdas/hello.ts'],
  outfile: 'dist/lambdas/hello/hello.mjs',
  ...options,
});

await esbuild.build({
  entryPoints: ['src/lambdas/hitcounter.ts'],
  outfile: 'dist/lambdas/hitcounter/hitcounter.mjs',
  ...options,
});
