const path = require('path')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const srcPath = path.resolve(__dirname, '../src')
const nodeModulesPath = path.resolve(__dirname, '../node_modules')

function isEditor(loaderContext) {
  return loaderContext.resource.indexOf('editor.scss') > -1
}

module.exports = {
  get: function (mode) {
    const isProduction = mode === 'production'

    return [
      {
        test: /\.(woff|woff2)$/,
        type: 'asset/resource',
        include: [srcPath + '/fonts', nodeModulesPath + '/@fontsource-variable', nodeModulesPath + '/@fontsource'],
        generator: {
          filename: 'fonts/[name][ext][query]',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        exclude: /icons/,
        include: srcPath + '/img',
        generator: {
          filename: 'images/[name][ext][query]',
        },
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        include: srcPath + '/img/icons',
        generator: {
          filename: 'images/icons/[name][ext][query]',
        },
        use: {
          loader: ImageMinimizerPlugin.loader,
          options: {
            minimizer: {
              implementation: ImageMinimizerPlugin.svgoMinify,
              options: {
                encodeOptions: {
                  // Pass over SVGs multiple times to ensure all optimizations are applied. False by default
                  multipass: true,
                  plugins: [
                    {
                      name: 'preset-default',
                    },
                    {
                      name: 'addAttributesToSVGElement',
                      params: {
                        attributes: [
                          {
                            focusable: false,
                          },
                          {
                            'aria-hidden': true,
                          },
                        ],
                      },
                    },
                    {
                      name: 'addClassesToSVGElement',
                      params: {
                        classNames: ['icon', '$name'],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        test: /\.js$/i,
        include: srcPath + '/js',
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'js',
            target: 'es2016',
            legalComments: 'inline',
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        include: srcPath + '/scss',
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: true,
              esModule: false,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: function (loaderContext) {
                let obj = {
                  plugins: {
                    'postcss-import': {},
                    'postcss-preset-env': {
                      browsers: 'last 2 versions, > 2%, not dead',
                      stage: 2,
                      features: {
                        // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
                        // https://stackoverflow.com/questions/64565180/how-to-prevent-postcss-preset-env-from-removing-css-logical-properties#answer-66966232
                        // Use stage 2 features + disable logical properties and values rule
                        'logical-properties-and-values': false,
                      },
                    },
                    'postcss-pxtorem': { propWhiteList: [] },
                    'postcss-sort-media-queries': {},
                  },
                }

                if (isProduction && !isEditor(loaderContext)) {
                  obj.plugins.cssnano = {}
                }

                return obj
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: function (loaderContext) {
                let obj = {
                  quietDeps: true,
                  sourceMap: true,
                }

                if (isProduction && isEditor(loaderContext)) {
                  obj.outputStyle = 'expanded'
                }

                return obj
              },
            },
          },
        ],
      },
    ]
  },
}
