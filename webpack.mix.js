let mix = require('laravel-mix');

mix.js('js/app.js', 'dist/js')
    .sass('styles/app.scss', 'dist/styles').options({
    processCssUrls: false
});
