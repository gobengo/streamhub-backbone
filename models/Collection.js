define([
    'backbone',
    'underscore',
    '../models/Content',
    '../const/sources',
    '../const/types',
    '../const/transformers'],
function (Backbone, _, Content, sources, types, transformers) {

/** @lends Collection */
var Collection = Backbone.Collection.extend(
/** @lends Collection.prototype */
{
    model: Content,
    /**
    Collections are sets of Content. The Content may be sourced
    from another Collection that lives in StreamHub's Cloud

    @class Collection
    @constructs
    @augments Backbone.Collection
    @param {Array} models - An Array of JSON Objects that will get turned into Content (https://gist.github.com/4527966)
    @param {Object} opts - Configuration options
    @param {Content} opts.parent - Optional. The parent of all items in the Collection

    @TODO Allow sourcing Content from more than one remote Collection

@example
var collection = Hub.Collection().setRemote({
    sdk: livefyreSdk,
    siteId: "303772",
    articleId: "prod0"
});
    */
    initialize: function (models, opts) {
        // Collections can have parents
        this.parent = opts && opts.parent;
        this._initialized = false; // initial content loaded
        this._started = false; // stream started
        this.on('sdkData', this._onSdkData);
        this.on('initialDataLoaded',  this._onInitialDataLoaded);
    }
});

/**
Bind the local Collection to a remote one in the Cloud,
and retrieve initial Content
@param {Object} remoteOptions - Information to resolve the remote Collection
@param {livefyreSdk} sdk - An instance of the StreamHub JavaScript SDK
@param {string} remoteOptions.siteId - The Site ID of the remote Collection
@param {string} remoteOptions.articleId - The Article ID of the remote Collection
@param {string} authToken - A Livefyre auth token for interacting with the Collection
@TODO Separate configuring the remote source from loading its data
*/
Collection.prototype.setRemote = function (remoteOptions) {
    this._sdk = remoteOptions.sdk;
    this._sdkCollection = this._sdk.getCollection({
        siteId: remoteOptions.siteId,
        articleId: remoteOptions.articleId
    });
    if (remoteOptions.authToken) {
        this._sdkCollection.setUserToken(remoteOptions.authToken);
    }
    this._sdkCollection.getInitialData(
        _.bind(this._initialDataSuccess, this),
        this._initialDataError);
    return this;
};

/**
Get information about an author of Content in the Collection
This proxies into the StreamHub SDK's `collection.getAuthor` method
@param {string} authorId - The ID of an author in the Collection

@throws Exception if Collection is not bound to a remote Collection
*/
Collection.prototype.getAuthor = function (authorId) {
    var parent = this.parent,
        parentCollection = parent && parent.collection,
        author;
    if (! this._sdkCollection) {
        if (parentCollection) {
            return parentCollection.getAuthor(authorId);
        } else {
            throw new Error("Called getAuthor, but there is no ._sdkCollection and no parent Collection");
        }
    }
    return this._sdkCollection.getAuthor(authorId);
};

/**
Returns a value that each item in the Collection should be sorted by.
By default, this is the Content's `createdAt` date
@param item - A Content model
*/
Collection.prototype.comparator = function (item) {
    return item.get('createdAt');
};

/**
Handle the response from fetching initial data from the remote Collection
@private
@fires Collection#sdkData
*/
Collection.prototype._initialDataSuccess = function (data) {
    this.trigger('sdkData', data);
};
/** Handle a failure in fetching initial date from the remote Collection
@private */
Collection.prototype._initialDataError = function () {
    console.log("Collection.prototype._initialDataError", arguments);
};

/**
Start the stream once the initial data is loaded
*/
Collection.prototype._onInitialDataLoaded = function () {
    // Once we have the intial data, we can start the stream.
    this._initialized = true;
    console.log('Collection: Starting stream');
    this.start();
};

/**
Handler for whenever sdkCollection tells us about data
in its standard format (on initialData and stream)
Emits states in order: Content first, then attachments, then Opines
@private
*/
Collection.prototype._onSdkData = function _onSdkData (sdkData) {
    var publicData = sdkData['public'],
        knownStateTypes = [types.CONTENT, types.OEMBED, types.OPINE],
        states = _(publicData).values(),
        statesByType = _(states).groupBy('type'),
        stateTypes = _(statesByType).keys(),
        unknownStateTypes = _(stateTypes).difference(_(knownStateTypes).map(String));

    if (_.isEmpty(publicData)) {
        return console.log("sdk emitted empty public data", arguments);
    }

    if (unknownStateTypes.length > 0) {
        console.log("Unknown state types", unknownStateTypes, sdkData);
    }

    // Handle states in this order
    var stateCount = 0;
    return _(knownStateTypes).forEach(function(type) {
        _(statesByType[type]).forEach(function(state) {
            stateCount++;

            this.handleSdkState(state);

            if (!this._initialized && stateCount === states.length) {
                console.log('SHCollection: Processed initial data. Ready to start stream');
                this.trigger('initialDataLoaded');
            }
        }, this);
    }, this);
};

/** Processes each individual state returned from the JS SDK
@fires Collection#sdkState
*/
Collection.prototype.handleSdkState = function (state) {
    var content,
        parentId,
        self = this;

    /**
    A single state from sdkData is being processed
    @event Collection#sdkState
    @type {sdkDataState} state - The individual state from the SDK */
    this.trigger('sdkState', state);
    if (state.type == types.OEMBED) {
        this._processOembed(state);
        return;
    }
    // Can only handle Content past here
    if (state.type != types.CONTENT) {
        console.log("Donno how to process this state, skipping.", state);
        return;
    }

    parentId = state.content.parentId;
    // Send replies to their parent,
    // unless of course the Content's parent is the same as the Collection's parent
    if (parentId && ! (this.parent && this.parent.get('id')===parentId) ) {
        var parentId = state.content.parentId,
            parent = this.get(parentId);
        if (! parent) return console.log("Cannot find parent for reply sdkState", state);
        parent.handleSdkState(state);
    } else {
    }

    content = new Content.fromSdk(state);
    // Give the new Content a computed property that will get the latest author info
    content.set('author', function () {
        return self.getAuthor(content.get('authorId'));
    });

    this.add(content);
};
/** Handle an oEmbed state that comes from the sdkData 
@private */
Collection.prototype._processOembed = function (oeItem) {
    var targetId = oeItem.content.targetId,
        target = this.get(targetId);
    if (! target) return console.log("Cannot find target for oEmbed", oeItem);
    target.handleSdkState(oeItem);
};

/**
Start streaming the remote Collection into the local Collection
*/
Collection.prototype.start = function () {
    if (this._started) {
        console.log("Collection.start() called, but already started");
        return this;
    }
    this._started = true;
    this._sdkCollection.startStream(
        _.bind(this._streamSuccess, this),
        this._streamError);
    return this;
};
/**
Handle a successful streaming response of sdkData
@param {Object} - StreamHub SDK data response
@fires Collection#sdkData */
Collection.prototype._streamSuccess = function (sdkData) {
    this.trigger('sdkData', sdkData);
};
// Handle a failing streaming response
Collection.prototype._streamError = function () {
    console.log("Collection.prototype._streamError", arguments);    
};

/**
Post Content into the Collection
*/
Collection.prototype.postContent = function (content, onSuccess, onError) {
    var sdkCollection = this._sdkCollection;
    if ( ! sdkCollection ) {
        return console.log("No sdkCollections, not posting");
    }

    sdkCollection.postContent(content, onSuccess, onError);
}

/**
Content has been added to the Collection
@event Collection#add
@type {Content} content - A Content model representing the added Content
*/

/**
A chunk of data has been emitted by the SDK.
This is the 'lowest level' to the SDK access. Raw responses
@event Collection#sdkData
@type {sdkData} states - The raw data from the SDK, with states and more
*/

/**
Initial data has been loaded from a remote Collection.
This should fire only once per remote Collection
@event Collection#initialDataLoaded
*/

return Collection;
});
