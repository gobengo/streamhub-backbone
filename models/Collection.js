define([
'backbone',
'underscore',
'../models/Content',
'../const/sources',
'../const/types',
'../const/transformers'],
/** @lends Collection **/
function (
Backbone,
_,
Content,
sources, types, transformers) {

/**
Collections are sets of Content. The Content may be sourced
from another Collection that lives in StreamHub's Cloud

@class Collection
@constructor
@augments Backbone.Collection

@param {Object} opts - 'Normal' Backbone opts to construct the Collection

@TODO Allow sourcing Content from more than one remote Collection
 */
var Collection = Backbone.Collection.extend(
/** @lends Collection.prototype */
{
	model: Content,
	/** The usual Backbone Collection initialize method */
	initialize: function (opts) {
		this._opts = opts || {};
		this._started = false;
		this.on('sdkData', this._onSdkData);
	}
});

/**
Bind the local Collection to a remote one in the Cloud,
and retrieve initial Content
@param {Object} remoteOptions - Information to resolve the remote Collection
@param {String} remoteOptions.siteId - The Site ID of the remote Collection
@param {String} remoteOptions.articleId - The Article ID of the remote Collection

@TODO Separate configuring the remote source from loading its data
*/
Collection.prototype.setRemote = function (remoteOptions) {
	this._sdk = remoteOptions.sdk;
	this._sdkCollection = this._sdk.getCollection({
		siteId: remoteOptions.siteId,
		articleId: remoteOptions.articleId
	});
	this._sdkCollection.getInitialData(
		_.bind(this._initialDataSuccess, this),
		this._initialDataError)
	return this;
};

/**
Get information about an author of Content in the Collection
This proxies into the StreamHub SDK's `collection.getAuthor` method
@param {String} authorId - The ID of an author in the Collection

@throws Exception if Collection is not bound to a remote Collection
*/
Collection.prototype.getAuthor = function (authorId) {
	if (! this._sdkCollection) {
		throw new Exception ("Called getAuthor, but there is no sdkCollection");
	}
	return this._sdkCollection.getAuthor(authorId);
}

/**
Returns a value that each item in the Collection should be sorted by.
By default, this is the Content's `createdAt` date
@param item - A Content model
*/
Collection.prototype.comparator = function (item) {
	return item.get('createdAt');
}

/**
Handle the response from fetching initial data from the remote Collection
Then start streaming the remote Collection
@private
*/
Collection.prototype._initialDataSuccess = function (data) {
	this.trigger('sdkData', data);
	this.start();
};
/** Handle a failure in fetching initial date from the remote Collection
@private */
Collection.prototype._initialDataError = function () {
	console.log("Collection.prototype._initialDataError", arguments);
};

/**
Handler for whenever sdkCollection tells us about data
in its standard format (on initialData and stream)
@private
*/
Collection.prototype._onSdkData = function _onSdkData (sdkData) {
	var publicData = sdkData.public,
		knownStateTypes = [types.CONTENT, types.OEMBED, types.OPINE],
	    states = _(publicData).values(),
		statesByType = _(states).groupBy('type'),
		stateTypes = _(statesByType).keys(),
		unknownStateTypes = _(stateTypes).difference(_(knownStateTypes).map(String));

	if (unknownStateTypes.length > 0) {
		console.log("Unknown state types", unknownStateTypes, sdkData);
	}

	// Handle states in this order
	return _(knownStateTypes).forEach(function(type) {
		_(statesByType[type]).forEach(this._handleSdkState, this)
	}, this);
}
/** Processes each individual state returned from the JS SDK
@private */
Collection.prototype._handleSdkState = function (state) {
	var item = state;
	this.trigger('sdkState', state);
	if (item.type == types.OEMBED) {
		this._processOembed(item);
		return
	}
	// Can only handle Content past here
	if (item.type != types.CONTENT) {
		console.log("Donno how to process this item, skipping.", item);
		return;
	}
	// Add author data
	// TODO: Bind author data later... at view time?
	var authorId = item.content.authorId;
	if (authorId) {
		item.content.author = this.getAuthor(authorId);
	}

	this.add(new Content.fromSdk(item));
}
/** Handle an oEmbed state that comes from the sdkData
@private*/
Collection.prototype._processOembed = function (oeItem) {
	var targetId = oeItem.content.targetId,
		target = this.get(targetId);
	if (! target) return console.log("Cannot find target for oEmbed", oeItem);
	target._handleSdkState(oeItem);
}

/**
Start streaming the remote Collection into the local Collection
*/
Collection.prototype.start = function () {
	if (this._started) {
		console.log("Collection.start() called, but already started");
		return this;
	}
	this._started = true
	this._sdkCollection.startStream(
		_.bind(this._streamSuccess, this),
		this._streamError);
	return this;
}
/** Handle a successful streaming response of sdkData
@param {Object} - StreamHub SDK data response
@private */
Collection.prototype._streamSuccess = function (sdkData) {
	this.trigger('sdkData', sdkData);
}
/** Handle a failing streaming response
@private */
Collection.prototype._streamError = function () {
	console.log("Collection.prototype._streamError", arguments);	
}

return Collection;
});
