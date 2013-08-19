require.config({
  packages: [{
    name: 'streamhub-backbone',
    location: '.'
  }],
  paths: {
    jquery: 'lib/jquery/jquery',
    underscore: 'lib/underscore/underscore',
    backbone: 'lib/backbone/backbone',
    mustache: 'lib/mustache/mustache',
    text: 'lib/requirejs-text/text',
    fyre: 'http://zor.t402.fyre.co/wjs/v3.0/javascripts/livefyre'
  },
  shim: {
    'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
    },
    'underscore': {
        exports: '_'
    }
  }
});