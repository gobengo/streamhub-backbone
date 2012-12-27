({
    baseUrl: ".",
    paths: {
        jquery: 'components/jquery/jquery',
        underscore: 'components/underscore/underscore',
        backbone: 'components/backbone/backbone',
        mustache: 'components/mustache/mustache',
        "streamhub-backbone": "main",
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
