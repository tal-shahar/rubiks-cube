module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.ignoreWarnings = [
        {
          module: /@mediapipe\/tasks-vision/,
          message: /Failed to parse source map/
        },
      ];
      
      // Production optimizations
      if (process.env.NODE_ENV === 'production') {
        // Remove console statements in production
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          minimize: true,
        };
        
        // Add terser plugin configuration to remove console statements
        const TerserPlugin = require('terser-webpack-plugin');
        webpackConfig.optimization.minimizer = [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
              },
            },
          }),
        ];
      }
      
      return webpackConfig;
    },
  },
};