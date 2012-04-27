rm -rf output
node r.js -o build.js

sed -i 's/js\/libs\/require\/require.js/http:\/\/requirejs.org\/docs\/release\/1.0.5\/minified\/require.js/g' output/index.html
