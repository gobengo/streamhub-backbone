require.config({
  packages: [{
    name: 'streamhub-backbone',
    location: '.'
  },{
    name: 'streamhub-backbone-test',
    location: './test'
  }],
  paths: {
    jquery: 'lib/jquery/jquery',
    underscore: 'lib/underscore/underscore',
    backbone: 'lib/backbone/backbone',
    mustache: 'lib/mustache/mustache',
    text: 'lib/requirejs-text/text',
    fyre: 'http://zor.t402.fyre.co/wjs/v3.0/javascripts/livefyre',
    jasmine: 'lib/jasmine/lib/jasmine-core/jasmine',
    'jasmine-html': 'lib/jasmine/lib/jasmine-core/jasmine-html',
    'jasmine-jquery': 'lib/jasmine-jquery/lib/jasmine-jquery',
  },
  shim: {
    'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
    },
    'underscore': {
        exports: '_'
    },
    jasmine: {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    },
    'jasmine-jquery': {
      deps: ['jquery', 'jasmine']
    }
  }
});