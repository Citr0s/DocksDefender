let mix = require('laravel-mix');

mix.js('src/js/app.js', 'dist/js')
    .sass('src/styles/app.scss', 'dist/styles')
    .copy('src/assets/*', 'dist/assets')
    .copy('index.html', 'dist')
    .options({
        processCssUrls: false
    })
    .webpackConfig({
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ["*", ".js", ".jsx", ".vue", ".ts", ".tsx"]
        }
    });
