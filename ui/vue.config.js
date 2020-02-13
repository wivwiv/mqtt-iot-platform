module.exports = {
  lintOnSave: false,
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: process.env.VUE_HOST_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  publicPath: process.env.VUE_APP_PUB_PATH || '/',
};
