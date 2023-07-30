import * as esbuild from 'esbuild'
import eslintPlugin from 'esbuild-plugin-eslint'
import stylePlugin from 'esbuild-style-plugin'
import manifestPlugin from 'esbuild-plugin-manifest'
//import stylelintPlugin from 'esbuild-plugin-stylelint'
import postCssPlugin from '@deanc/esbuild-plugin-postcss'

async function bundle() {
  try {
    // build
    await esbuild.build({
      entryPoints: [
        'src/js/index.js',
        'src/js/editor.js',
        'src/js/post-build.js',
        'src/scss/style.scss',
        'src/scss/editor.scss',
        'src/scss/login.scss',
      ],
      assetNames: 'assets/[name]-[hash]',
      chunkNames: 'assets/[name]-[hash]',
      loader: {
        '.png': 'file',
        '.jpg': 'file',
        '.gif': 'file',
        '.woff': 'file',
        '.woff2': 'file',
        '.svg': 'file',
      },
      bundle: true,
      minify: true,
      outdir: 'dist',
      target: ['chrome114', 'firefox114', 'safari15', 'edge114'],
      sourcemap: false,
      plugins: [
        stylePlugin(),
        postCssPlugin({
          plugins: [
            {
              'postcss-import': {},
              'postcss-preset-env': {
                browsers: 'last 2 versions',
                stage: 0,
              },
              'postcss-pxtorem': { propWhiteList: [] },
              'postcss-sort-media-queries': {},
            },
          ],
        }),
       // stylelintPlugin({ fix: true}),
        eslintPlugin(),
        manifestPlugin({ shortNames: 'input' }),
      ],
    })

    console.log('Build successful!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

bundle()
