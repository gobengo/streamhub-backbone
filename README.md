# Builds

`streamhub-backbone.almond.js` has a pre-loaded AMD loader as `require`. You probably want to use that unless your project uses RequireJS.

You can use this to put Streams and Hubs together.

This is a new project. But please feel free to leave a GitHub issue to report a bug or just say Hi. Seeking advice.

# DANGER

* Pretty much any usage will probably require reading the internals. I'll get better at that. Creating internal modules as they are necessary.
* The 1.0 release will be the first 'stable' one. Until then, it's the wild west.
* You can email me with questions at ben@livefyre.com, but may not have time to help right away

# Example Usage

    require(['streamhub-backbone'], function (Hub) {
    var app = new Hub({
        sdk: livefyreSdk,
        collection: {
            siteId: "303772",
            articleId: "prod0"
        },
        el: document.getElementById("example")
    })});

# TODO

* Organize Activity and Content. Presumably there will eventually be distinct Backbone Collections for both. First priorities will probably be on Content display, likes, images, timestamps.
* Enable interaction
* Make sure tweets display according to the Twitter display requirements
** An alternative view that uses Blackberry Pie, if you want to explode your browser with hundreds of iframe loads
* Document
* Tests and test data. I'll probably due this sooner rather than later.

# Constructor

The module can be used with `new` to construct a Hub for Streams to play in. It accepts these parameters:

* `sdk` - An instance of the Livefyre StreamHub JS SDK, loaded from `fyre.conv.load`

            fyre.conv.load({}, [{app: 'sdk'}], Hub); // TODO: make this work

* `collection` - An object with the siteid and articleId of the Collection you want to display. There will someday be support for many Collections bound to one Hub, or other sets of Content like results from the Most Liked API
* `el` - The HTML Element to display in
* `view` - (DefaultView) - A Backbone View that should handle the visuals. Hub will create a Collection model and start it up, then proxy to your View for arbitrary forms of hubbing and streaming

# Models

## Hub.models.Content

The good stuff. Content has the following attributes:

    * id
    * event
    * html
    * ancestorId
    * annotations
    * author
    * authorId
    * createdAt
    * updatedAt
    * replaces
    * parentId
    * source
    * transport
    * type
    * vis

Content can be instantiated from SDK Data

    var c = new Content(sdkData);

or locally with just HTML

    var c = new Content("<p>Yep</p>");

## Hub.models.Collection

This is a type of Backbone Collection that knows how to deal with Content. It wraps the collections returned from `sdk.getCollection`.

    var collection = Hub.Collection().setRemote({
        sdk: livefyreSdk,
        siteId: "303772",
        articleId: "prod0"
    });

### Events

`sdkData` - fired when data objects are passed from the internal sdkCollection on initial data and streamed data. Standard sdk response obj passed.

    collection.on('sdkData', function(sdkData) {
        var publicData = sdkData.public;
        // Do stuff
    });

### Methods

`.getAuthor(authorId)` - Convenience proxy for internal sdkCollection.getAuthor

## Hub.models.Content

This represents a piece of Content 

# Views

## Hub.views.DefaultView

It's just a really simple default feed. It will strive to be the most boring, stable View around. But it should probably be able to accept pluggable ContentViews and maybe even just templates without much sweat. I should be able to just pass an HTML template to Hub(..) constructor.
