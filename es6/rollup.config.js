import nodeResolve  from 'rollup-plugin-node-resolve'
import commonjs     from 'rollup-plugin-commonjs'
import babel        from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint';

export default {
  entry: 'src/main.js',
  dest: 'dist/bundle.js',
  plugins: [
    eslint(),
    nodeResolve({ jsnext: true }), // npmモジュールを`node_modules`から読み込む
    commonjs(), // CommonJSモジュールをES6に変換
    babel() // ES5に変換
  ]
}
