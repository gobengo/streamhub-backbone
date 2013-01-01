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
SHContent,
sources, types, transformers) {
	var SHCollection = Backbone.Collection.extend({
		model: SHContent,
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

	ItemProcessors = {};
	ItemProcessors[sources.STREAMHUB] = function (ugc) {
	}
	ItemProcessors[sources.TWITTER] = function (rssItem) {

	}
	ItemProcessors[sources.RSS] = function (rssItem) {
		var c = {},
			feedEntry = rssItem.content.feedEntry;

		if ( ! feedEntry ) {
			return c;
		}
		if (feedEntry.transformer == transformers.INSTAGRAM_BY_TAG) {
			// Add oEmbed photo attachment for Instagram photo
			c.attachments = [{
				version: '1.0',
				type: 'photo',
				provider: 'instagram',
				width: '612',
				height: '612',
				url: feedEntry.link
			}];
		}
		return c;
	};
	/*
	 * Handler for whenever sdkCollection tells us about data
	 * in its standard format (on initialData and stream)
	 */
	SHCollection.prototype._onSdkData = function _onSdkData (sdkData) {
		var items = this._processResponseItems(sdkData);
		this.add(items);
	}
	SHCollection.prototype._processResponseItems = function (itemsObj) {
		var data = itemsObj,
			self = this,
			publicItems = data.public,
			itemsToProcess = [],
			items = [];

		for (var id in publicItems) { if (publicItems.hasOwnProperty(id)) {
			itemsToProcess.push(publicItems[id]);
		}}
		items = _(itemsToProcess).map(_.bind(this._processItem, this));
		return _(items).compact();
	}
	SHCollection.prototype._processItem = function (item) {
		var c = {},
			processor = ItemProcessors[item.source];

		if (item.type == types.OEMBED) {
			this._processOembed(item);
			return
		}
		// Can only handle Content past here
		if (item.type != types.CONTENT) {
			console.log("Donno how to process this item, skipping.", item);
			return;
		}

		c.id = item.id;
		c.authorId = item.content.authorId;
		c.author = this._sdkCollection.getAuthor(c.authorId);
		c.bodyHtml = item.content.bodyHtml;
		c.createdAt = item.content && item.content.createdAt || null;
		c.source = item.source+'';
		c.type = item.type+'';

		// If there is a custom processor for the Content source,
		// get the source-specific data and pluck onto `c`
		if (processor) {
			var newData = processor(item);
			_(c).extend(newData);
		}

		return c;
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
