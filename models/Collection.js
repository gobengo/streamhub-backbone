define([
'backbone',
'underscore',
'../models/Content',
'../const/sources',
'../const/types',
'../const/transformers'],
function (
Backbone,
_,
Content,
sources, types, transformers) {
	var SHCollection = Backbone.Collection.extend({
		model: Content,
		initialize: function (opts) {
			this._opts = opts || {};
			this._started = false;
			this.on('sdkData', this._onSdkData);
		}
	});

	// Public Interface
	SHCollection.prototype.setRemote = function (remoteOptions) {
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

	SHCollection.prototype.getAuthor = function (authorId) {
		if (! this._sdkCollection) {
			throw new Exception ("Called getAuthor, but there is no sdkCollection");
		}
		return this._sdkCollection.getAuthor(authorId);
	}

	// Internals
	SHCollection.prototype.comparator = function (item) {
		return item.get('createdAt');
	}

	// Initial data
	SHCollection.prototype._initialDataSuccess = function (data) {
		this.trigger('sdkData', data);
		this.start();
	};
	SHCollection.prototype._initialDataError = function () {
		console.log("SHCollection.prototype._initialDataError", arguments);
	};

	/*
	 * Handler for whenever sdkCollection tells us about data
	 * in its standard format (on initialData and stream)
	 */
	SHCollection.prototype._onSdkData = function _onSdkData (sdkData) {
		var publicData = sdkData.public,
			knownMessageTypes = [types.CONTENT, types.OEMBED, types.OPINE],
		    messages = _(publicData).values(),
			messagesByType = _(messages).groupBy('type'),
			messageTypes = _(messagesByType).keys(),
			unknownMessageTypes = _(messageTypes).difference(_(knownMessageTypes).map(String));

		if (unknownMessageTypes.length > 0) {
			console.log("Unknown message types", unknownMessageTypes, sdkData);
		}

		// Handle messages in this order
		return _(knownMessageTypes).forEach(function(type) {
			_(messagesByType[type]).forEach(this._handleSdkMessage, this)
		}, this);
	}
	/*
	 * Processes each individual message returned from the JS SDK
	 */
	SHCollection.prototype._handleSdkMessage = function (message) {
		var item = message;
		this.trigger('sdkMessage', message);
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

	SHCollection.prototype._processOembed = function (oeItem) {
		console.log("TODO Need to process oEmbed", oeItem);
	}

	// Streaming
	SHCollection.prototype.start = function () {
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
	SHCollection.prototype._streamSuccess = function (sdkData) {
		this.trigger('sdkData', sdkData);
	}
	SHCollection.prototype._streamError = function () {
		console.log("SHCollection.prototype._streamError", arguments);	
	}
	return SHCollection;
});
