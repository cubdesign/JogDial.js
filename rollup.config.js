import riot from 'rollup-plugin-riot'
import nodeResolve  from 'rollup-plugin-node-resolve'
import commonjs     from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint';
import buble from 'rollup-plugin-buble'

const options = {
  ext: 'tag.html'
}

export default {
  entry: 'src/main.js',
  dest: 'dist/bundle.js',
  format: 'iife',
  // sourceMap: 'inline',
  plugins: [
    riot(options),
    nodeResolve({ jsnext: true }), // npmモジュールを`node_modules`から読み込む
    commonjs(), // CommonJSモジュールをES6に変換
    eslint(),
    buble()
  ]
}
