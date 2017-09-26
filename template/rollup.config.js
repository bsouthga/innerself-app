import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import { minify } from 'uglify-es';

const prod = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.ts',
  plugins: [
    typescript(),
    resolve(),
    ...(prod
      ? [uglify({}, minify)]
      : [
          serve({ contentBase: 'public', historyApiFallback: true }),
          livereload()
      ]),
      babel()
  ],
  output: {
    file: 'public/bundle.js',
    format: 'iife'
  }
};
