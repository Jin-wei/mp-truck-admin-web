const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.base.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const PrerenderSPAPlugin = require('prerender-spa-plugin');
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
// naming output files with hashes for better caching.
// dist/index.html will be auto-generated with correct URLs.
config.output.filename = '[name].[chunkhash].js'
config.output.chunkFilename = '[id].[chunkhash].js'

// whether to generate source map for production files.
// disabling this can speed up the build.
let SOURCE_MAP = false

config.devtool = SOURCE_MAP ? 'source-map' : false

config.plugins = (config.plugins || []).concat([
//  new webpack.ProvidePlugin({
//    $: 'jquery',
//    jQuery: 'jquery',
//    'window.jQuery': 'jquery'
//  }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    // extract css into its own file
    new ExtractTextPlugin('[name].[contenthash].css'),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /build/index.template.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
        filename: '../index.html',
        template: 'src/index.ejs',
        title: '车队云管家',
        favicon: "favicon_2.ico",
        minify: {
            removeComments: true,
            collapseWhitespace: true
        }
    })
    // new PrerenderSPAPlugin({
    //     // 生成文件的路径，也可以与webpakc打包的一致。
    //     staticDir: path.join(__dirname, '../dist'),
    //     // 对应自己的路由文件，比如index有参数，就需要写成 /index/param1。
    //     routes: ['/', '/webstatic'],
    //     renderer: new Renderer({
    //         renderAfterTime: 5000 // Wait 5 seconds.
    //         // headless: false
    //     })
    // })
])

module.exports = config
