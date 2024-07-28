import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs'
import html2 from 'rollup-plugin-html2';

const input = [
    'js/2D/pan.js', 'js/2D/circling.js', 'js/2D/grid.js',
    'js/2D/cutting.js', 'js/2D/rectangling.js', 'js/2D/render.js',
    'js/3D/render.js',
    'js/index.js'
]

export default {
    input: input,
    output: {
        dir: 'dist',
        name: 'bundle',
        format: 'es',
        entryFileNames: '[name]-[hash].js',
        globals: {
            'fabric': 'fabric',
            'three': 'three',
        }
    },
    plugins: [
        commonjs(),
        nodeResolve({
            moduleDirectories: ['node_modules']
        }),
        html2({
            template: 'index.html',
            fileName: 'dist/index.html'
        }),
        babel({
            exclude: 'node_modules/**',
            presets: ['@babel/preset-env'],
            babelHelpers: 'bundled'
        }),
    ],
    // explisitly set templateIsFile to false to avoid error
    cache: {
        templateIsFile: false
    }
}
