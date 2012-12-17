You can use this to put Streams and Hubs together.

This is a new project. But please feel free to leave a GitHub issue to report a bug or just say Hi. Seeking advice.

# DANGER

* Pretty much any usage will probably require reading the internals. I'll get better at that. Creating internal modules as they are necessary.
* The 1.0 release will be the first 'stable' one. Until then, it's the wild west.
* You can email me with questions at ben@livefyre.com, but may not have time to help right away

# Example Usage

    var app = new Hub({
        sdk: livefyreSdk,
        collection: {
            siteId: "303772",
            articleId: "prod0"
        },
        el: document.getElementById("example")
    }).start();

# TODO

* Organize Activity and Content. Presumably there will eventually be distinct Backbone Collections for both. First priorities will probably be on Content display, likes, images, timestamps.
* Enable interaction
* Make sure tweets display according to the Twitter display requirements
** An alternative view that uses Blackberry Pie, if you want to explode your browser with hundreds of iframe loads

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

It's just a really simple default feed. It will strive to be the most boring, stable View around. But it should probably be able to accept pluggable ContentViews and maybe even just templates without much sweat. I should be able to just pass an HTML template to Hub(..) constructor.
