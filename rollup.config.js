import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import { version } from './package.json';

const globals = {
  'backbone': 'Backbone',
  'underscore': '_',
  'backbone.radio': 'Backbone.Radio'
};

const now = new Date();
const year = now.getFullYear();

const banner = `/**
* @license
* MarionetteJS (Backbone.Marionette)
* ----------------------------------
* v${version}
*
* Copyright (c)${year} Derick Bailey, Muted Solutions, LLC.
* Distributed under MIT license
*
* http://marionettejs.com
*/\n\n`;

const footer = 'this && this.Marionette && (this.Mn = this.Marionette);';

export default [
  {
    input: 'src/backbone.marionette.js',
    external: ['underscore', 'backbone', 'backbone.radio'],
    output: [
      {
        file: 'lib/backbone.marionette.js',
        format: 'umd',
        name: 'Marionette',
        exports: 'named',
        sourcemap: true,
        globals,
        banner,
        footer
      },
      {
        file: 'lib/backbone.marionette.esm.js',
        format: 'es'
      }
    ],
    plugins: [
      eslint({ exclude: ['package.json'] }),
      json(),
      babel()
    ]
  },
  {
    input: 'src/backbone.marionette.js',
    external: ['underscore', 'backbone', 'backbone.radio'],
    output: [
      {
        file: 'lib/backbone.marionette.min.js',
        format: 'umd',
        name: 'Marionette',
        exports: 'named',
        sourcemap: true,
        globals,
        banner,
        footer
      }
    ],
    plugins: [
      json(),
      babel(),
      terser({ output: { comments: /@license/ }})
    ]
  }
]
