import babel from '@rollup/plugin-babel';
import path from 'path';
import nodeResolve from '@rollup/plugin-node-resolve'
import typeScript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const isProduction = process.env.NODE_ENV === 'production'
const pluginsWithEnv = isProduction ? [] : [serve({
  open: true,
  openPage: '/base/',
  port: 10001,
  contentBase: ['dist', 'examples']
}), livereload('dist/umd')]

export default {
  input: path.resolve(__dirname, './src/index.ts'),
  output: [
    {
      file: path.resolve(__dirname, 'dist/umd/index.js'),
      format: 'umd',
      name: 'rain'
    }
  ],
  plugins: [
    typeScript(),
    babel({
      presets: ['@babel/preset-env'],
      exclude: 'node_modules/**',
    }),
    nodeResolve(),
    json(),
    commonjs(),
    ...pluginsWithEnv
  ],
};