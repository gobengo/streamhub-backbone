[StreamHub-Backbone](http://gobengo.github.com/streamhub-backbone/) binds Livefyre StreamHub with Backbone.js so you can make amazing Content experiences like comment feeds, media walls, and slideshows. This is the core library, and there are other libraries for pluggable Views.

StreamHub-Backbone was used to power Livefyre's [CES 2013 NewsHub](http://ces.livefyre.com/)

![CES 2013 NewsHub Screenshot](http://d.pr/i/71lK+)

[StreamHub](http://www.livefyre.com/streamhub/) is [Livefyre](http://www.livefyre.com/)'s Engagement Management System that collects, hosts, and streams social Content in real-time straight to your users' browsers. The world's biggest publishers and brands use StreamHub to power their online Content Communities.

[Backbone.js](http://backbonejs.org/) is an MVC framework for building JavaScript applications that was sent from the heavens to make JavaScript fun again. Big thanks to @documentcloud.

# Using it

[Bower](http://twitter.github.com/bower/) is used for dependency management. You can install the dependencies with

    bower install

If you are unable to use bower, you can download the components dir as a tar

    curl -L "http://d.pr/f/DC3b+" > components.tar.gz
    tar -xvf components.tar.gz

StreamHub-Backbone is written as a series of [AMD](http://requirejs.org/docs/whyamd.html) modules. You will need to use an AMD loader like [RequireJS](http://requirejs.org/) to use it. Add it as a package in your RequireJS config:

    packages: [{
        name: 'streamhub-backbone',
        location: './path/to/streamhub-backbone'
    }]

Then you can use it like:

    require(['streamhub-backbone'], function (Hub) {
        // Hub some Streams, yo
    })

If you refuse to use your own AMD loader, `streamhub-backbone.almond.js` has a pre-loaded AMD loader as `require`. You probably want to use that unless your project uses RequireJS. (TODO: Namespace this require)

This is a new project. It will have bugs and is released under an MIT License. Please feel free to leave a GitHub issue to report a bug, submit a Pull Request, or just say Hi.

If you are using this in production for important things, you should fork the repo.

`main.css` contains some good default styles for the default views.

# Example

Most interesting things involve using the StreamHub JavaScript SDK, which you can find [here](http://zor.fyre.co/wjs/v3.0/javascripts/livefyre.js)

Load an sdk for a given StreamHub Network, then create a Hub

    require(['streamhub-backbone'], function (Hub) {
        fyre.conv.load({
            network: 'labs.fyre.co'
        }, [{
            app: 'sdk'
        }], _loadApp);
        function _loadApp (sdk) {
            var app = new Hub({
                el: document.getElementById("example-id"),
                sdk: sdk,
                collection: {
                    siteId: '320568',
                    articleId: "brands_canonical"
                }
            });
        }
    });

You can also see some demos in `index.html`, `index-built.html` (with almond build), and `test/examples/*`.

# Hub Constructor

The module can be used with `new` to construct a Hub for Streams to play in. It accepts these parameters:

* `sdk` - An instance of the Livefyre StreamHub JS SDK, loaded from `fyre.conv.load`
* `collection` - An object with the siteid and articleId of the Collection you want to display. There will someday be support for many Collections bound to one Hub, or other sets of Content like results from the Most Liked API
* `el` - The HTML Element to display in
* `view` - (FeedView) - A Backbone View that should handle the visuals. Hub will create a Collection model and start it up, then proxy to your View for arbitrary forms of hubbing and streaming

# Documentation

StreamHub-Backbone uses [jsdoc3](http://usejsdoc.org/) to generate HTML documentation from the source code.

You can [read the docs here](http://gobengo.github.com/streamhub-backbone/docs/).

## Building the Documentation

The code is documented using [jsdoc3](https://github.com/jsdoc3/jsdoc). From the project root:

Install jsdoc3

    npm install git://github.com/jsdoc3/jsdoc.git
    
Generate this project's docs into the 'docs' directory

    node_modules/jsdoc/jsdoc -c tools/jsdoc.conf.js models/* views/* main.js const/* README.md templates/* -d docs

# Tests

There are a decent number of tests written for StreamHub-Backbone's core models and views. There is a jasmine runner you can use in `test/index.html` and BDD specs in `test/spec`.

You can always [run the tests online](http://gobengo.github.com/streamhub-backbone/test/).

# Building

Generate almond build:

    node tools/r.js -o tools/build.js

