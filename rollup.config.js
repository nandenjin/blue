import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { string } from 'rollup-plugin-string'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'umd'
  },
  plugins: [
    typescript(),
    resolve(),
    string({
      include: ['**/*.glsl']
    }),
    commonjs()
  ]
}
