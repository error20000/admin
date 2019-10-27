const webpack = require('webpack');

module.exports = {
    publicPath: '/admin',
    configureWebpack: {
        plugins: [
          new webpack.ProvidePlugin({
              jquery: 'jquery',
              $: 'jquery'
          })
        ]
    },
    devServer: {
        proxy: {
          '/api': {
            target: 'http://127.0.0.1:8065',
            ws: true,
            changeOrigin: true
          }
        }
    }
    
}