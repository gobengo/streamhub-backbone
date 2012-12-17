# Builds

`streamhub-backbone.almond.js` has a pre-loaded AMD loader as `HUB.require`. You probably want to use that unless your project uses RequireJS.

You can use this to put Streams and Hubs together.

This is a new project. But please feel free to leave a GitHub issue to report a bug or just say Hi. Seeking advice.

# Example Usage

    HUB.require(['streamhub-backbone'], function (Hub) {
    var app = new Hub({
        sdk: livefyreSdk,
        collection: {
            siteId: "303772",
            articleId: "prod0"
        },
        el: document.getElementById("example")
    })});

# Constructor

The module can be used with `new` to construct a Hub for Streams to play in. It accepts these parameters:

* `sdk` - An instance of the Livefyre StreamHub JS SDK, loaded from `fyre.conv.load`

            fyre.conv.load({}, [{app: 'sdk'}], Hub); // TODO: make this work

* `collection` - An object with the siteid and articleId of the Collection you want to display. There will someday be support for many Collections bound to one Hub, or other sets of Content like results from the Most Liked API
* `el` - The HTML Element to display in
* `view` - (DefaultView) - A Backbone View that should handle the visuals. Hub will create a Collection model and start it up, then proxy to your View for arbitrary forms of hubbing and streaming

# Models

## Hub.models.Collection

This is a type of Backbone Collection that knows how to deal with Content. It wraps the collections returned from `sdk.getCollection`.

## Hub.models.Content

This represents a piece of Content 

# Views

## Hub.views.DefaultView