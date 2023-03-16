const mix = require('laravel-mix');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //eslint-disable-line
require('laravel-mix-purgecss');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
  .webpackConfig({
    plugins: [
      new Dotenv(),
      new AntdDayjsWebpackPlugin(),
      // new BundleAnalyzerPlugin(),
    ],   
  })
  .react('resources/js/app.js', 'public/js')  
  .less('resources/less/app.less', 'public/css', {
    lessOptions: { javascriptEnabled: true }
  })  
  .postCss('resources/css/app.css', 'public/css/custom-tailwind.css', [
    require('tailwindcss'),
  ])
  .purgeCss({
    extend: {
      whitelistPatterns: [/^ant/],
    },
  });
  
