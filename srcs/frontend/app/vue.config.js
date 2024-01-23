const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
    },
  },
  devServer: {
    proxy: {
      '^/api': {
        target: process.env.VUE_APP_SERVER_API,
        changeOrigin: true
      }
    }
  }
})
