define(function (require) {
	var Backbone = require('backbone'),
		_ = require('underscore'),
		SHContent = require('../models/Content'),
		sources = require('../const/sources'),
		types = require('../const/types'),
		transformers = require('../const/transformers');

	var SHCollection = Backbone.Collection.extend({
		model: SHContent,
		initialize: function () {
		}
	});

	SHCollection.prototype.comparator = function (item) {
		return item.get('createdAt');
	}
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

		// Can only handle Content so far
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
	// Initial data
	SHCollection.prototype._initialDataSuccess = function (data) {
		console.log("SHCollection._initialDataSuccess", data);
		var contents = this._processResponseItems(data);
		this.add(contents);
		this.start();
	}
	SHCollection.prototype._initialDataError = function () {
		console.log("SHCollection.prototype._initialDataError", arguments);
	}

	// Streaming
	SHCollection.prototype.start = function () {
		this._sdkCollection.startStream(
			_.bind(this._streamSuccess, this),
			this._streamError);
		return this;
	}
	SHCollection.prototype._streamSuccess = function (data) {
		console.log("SHCollection._streamSuccess", data);
		var contents = this._processResponseItems(data);
		this.add(contents);
	}
	SHCollection.prototype._streamError = function () {
		console.log("SHCollection.prototype._streamError", arguments);	
	}
	return SHCollection;
});
