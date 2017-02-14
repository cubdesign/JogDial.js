import nodeResolve  from 'rollup-plugin-node-resolve'
import commonjs     from 'rollup-plugin-commonjs'
import babel        from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint';

export default {
  entry: 'src/main.js',
  dest: 'dist/bundle.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
    nodeResolve({ jsnext: true }), // npmモジュールを`node_modules`から読み込む
    commonjs(), // CommonJSモジュールをES6に変換
    eslint(),
    babel({
      exclude: 'node_modules/**'
    }) // ES5に変換
  ]
}
