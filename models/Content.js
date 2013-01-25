define([
    'require',
    'backbone',
    'underscore',
    'streamhub-backbone/models/Collection',
    'streamhub-backbone/views/FeedView',
    'streamhub-backbone/const/sources',
    'streamhub-backbone/const/types',
    'streamhub-backbone/const/transformers'],
function (require, Backbone, _, Collection, FeedView, sources, types, transformers) {
"use strict";

/** @lends Content */
var Content = Backbone.Model.extend(
/** @lends Content.prototype */
{
    /**
    Stuff a user might want to look at.
    Content may be sourced from another Collection that lives in StreamHub's Cloud.
    When this is the case, Content is instantiated with json like this https://gist.github.com/4527966
    Otherwise, it can be passed a string of bodyHtml (WIP)

    @class Content
    @constructs
    @augments Backbone.Model
    @param {Object} props - Properties that should be .set on the Content Model. Backbone style.
    @param {string} props.id - The ID of the Content in StreamHub
    @param {Number} props.event - The ID of the event in StreamHub spacetime
    @param {string} props.bodyHtml - An HTML snippet for the main textual part of the Content
    @param {string} props.authorId - The ID of the Author in StreamHub
    @param {Object} props.author - Hydrated author data, if you have it handy
    @param {oEmbed[]} props.attachments - Attached media to display with the Content
    @param {Number} props.createdAt - Unix timestamp of when the Content was originally created
    @param {Number} props.updatedAt - Unix timestamp of when the Content was updated (perhaps edited)
    @param {string} props.replaces - ID of the Content that this Content should replace in displays (perhaps because of an edit)
    @param {string} props.parentId - ID of the parent Content
    @param {Number} props.source - Enum of the Content source. See `const/sources`
    @param {Number} props.type - Enum of the sdkData state type. See `const/types`
    */
    constructor: function (htmlOrObj) {
        var attrs = {};
        // Allow passing HTML string as only param (#TODO demo)
        if (typeof(htmlOrObj)==='object') {
            attrs = htmlOrObj;
        } else {
            attrs.bodyHtml = htmlOrObj;
        }
        Backbone.Model.prototype.constructor.call(this, attrs);
    },
    /** Runs when constructing too.
    This is the usual initialize method most Backbone Models should use **/
	initialize: function (attrs) {
        // We have to re-require Collection here because there
        // is a circular dependency - see http://bit.ly/JQ8rJj
        var Collection = require('streamhub-backbone/models/Collection');
        // Each piece of Content has a Collection of reply Content
        this.replies = nestCollection(this, 'replies', new Collection([],{
            parent: this
        }));
	},
    // Override .get so that if the attribute is a function, it returns the result
    // of invocation. This is useful for the author attr - http://bit.ly/xCr07d
    // Basically it allows for computed properties
    get: function(attr) {
        var value = Backbone.Model.prototype.get.call(this, attr);
        return ( _.isFunction(value) ? value.call(this) : value );
    },
    // When serializing to JSON, make sure to use the result of .get() since now
    // that may be a computed property
    toJSON: function() {
        var data = {};
        var json = Backbone.Model.prototype.toJSON.call(this);
        _.each(json, function (value, key) {
          data[key] = this.get(key);
        }, this);
        return data;
    }
});

/**
Create a piece of Content from the JS sdkData 'state' response format
*/
Content.fromSdk = function (d) {
    var c = d.content,
        attrs,
        attachments = _getAttachmentsFromState(d);
    // pluck information from sdkData in just the right way
    attrs = {
        id: d.id ,
        event: d.event,
        bodyHtml: c.bodyHtml,
        ancestorId: c.ancestorId,
        annotations: c.annotations,
        authorId: c.authorId,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        replaces: c.replaces || null,
        parentId: c.parentId || null,
        source: d.source,
        transport: d.transport,
        type: d.type,
        vis: d.vis
    };
    if (c.author) {
        attrs.author = c.author;
    }
    if (attachments) {
        attrs.attachments = attachments;
    }
    return new Content(attrs);
};

/**
Content models themselves can handle SdkState information
that is relevant to them. That way the Content can emit it's
own `reply` and `like` events and stuff
@TODO make actual `reply` events 'and stuff'
*/
Content.prototype.handleSdkState = function (state) {
    // _handleSdkOembedState will attach oEmbeds
    if (state.type==types.OEMBED) return this._handleSdkOembedState(state);

    // add any replies to the .replies Collection
    if (state.type==types.CONTENT && state.content.parentId===this.get('id')) {
        this.replies.handleSdkState(state);
    }
};
/**
Handle streaming attachments
*/
Content.prototype._handleSdkOembedState = function (state) {
    var newAttachments = _getAttachmentsFromState(state),
        oldAttachments = this.get('attachments') || [];
    if (newAttachments) {
        this.set('attachments', oldAttachments.concat(newAttachments));
    }
};

/**
There may be information that could lead to an attachment representation
hiding in the sdkData state. This plucks them out in the case of an RSS Image feed
But I think those might now come down as types.OEMBED states
@private
@todo Grab more attachments, or test to see if this is necessary now
*/
function _getAttachmentsFromState (s) {
    // Only do this for RSS for now
    if (s.source==sources.RSS) return _getAttachmentFromRssState(s);
    if (s.type==types.OEMBED) return _getAttachmentFromOembedState(s);
    function _getAttachmentFromRssState (s) {
        var feedEntry = s.content.feedEntry;
        if ( ! feedEntry ) return;

        if (feedEntry.transformer == transformers.INSTAGRAM_BY_TAG) {
            // Add oEmbed photo attachment for Instagram photo
            return [{
                version: '1.0',
                type: 'photo',
                provider: 'instagram',
                width: '612',
                height: '612',
                url: feedEntry.link
            }];
        } 
    }
    function _getAttachmentFromOembedState (s) {
        return [s.content.oembed];
    }
}

/**
A helper to nicely nest a Backbone Collection as a property of a Model - http://bit.ly/PBa61J
*/
function nestCollection (model, attributeName, nestedCollection) {
    //setup nested references
    for (var i = 0; i < nestedCollection.length; i++) {
      model.attributes[attributeName][i] = nestedCollection.at(i).attributes;
    }
    //create empty arrays if none

    nestedCollection.on('add', function (initiative) {
        if (!model.get(attributeName)) {
            model.attributes[attributeName] = [];
        }
        model.get(attributeName).push(initiative.attributes);
    });

    nestedCollection.on('remove', function (initiative) {
        var updateObj = {};
        updateObj[attributeName] = _.filter(model.get(attributeName), function(attrs) {
            return attrs._id !== initiative.attributes._id;
        });
        model.set(updateObj);
    });
    return nestedCollection;
}

return Content;
});
