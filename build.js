({
    baseUrl: ".",
    paths: {
        jquery: 'components/jquery/jquery',
        underscore: 'components/underscore/underscore',
        backbone: 'components/backbone/backbone',
        "streamhub-backbone": "main",
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
    name: "almond",
    out: "streamhub-backbone.almond.js",
    include: ['streamhub-backbone'],
})
