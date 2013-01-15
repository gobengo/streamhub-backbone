({
    baseUrl: "..",
    packages: [{
        name: 'streamhub-backbone',
        location: '.'
    }],
    paths: {
        jquery: 'components/jquery/jquery',
        underscore: 'components/underscore/underscore',
        backbone: 'components/backbone/backbone',
        mustache: 'components/mustache/mustache',
        text: 'components/requirejs-text/text'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    },
    name: "tools/almond",
    out: "../streamhub-backbone.almond.js",
    include: ['streamhub-backbone']
})
