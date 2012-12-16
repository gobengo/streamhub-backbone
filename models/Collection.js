define(function (require) {
	var Backbone = require('backbone'),
		_ = require('underscore'),
		SHContent = require('../models/Content'),
		sources = require('../const/sources'),
		transformers = require('../const/transformers');

	var SHCollection = Backbone.Collection.extend({
		model: SHContent,
		initialize: function () {
		}
	});
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

	// Initial data
	SHCollection.prototype._initialDataSuccess = function (data) {
		console.log("SHCollection._initialDataSuccess", data);
		var self = this,
			publicItems = data.public,
			itemsToProcess = [],
			items = [];

		for (var id in publicItems) { if (publicItems.hasOwnProperty(id)) {
			itemsToProcess.push(publicItems[id]);
		}}

		_.map(itemsToProcess, function processInitialItem (item) {
			var c = {},
				processor = ItemProcessors[item.source];

			c.id = item.id;
			c.authorId = item.content.authorId;
			c.author = self._sdkCollection.getAuthor(c.authorId);
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

			if (c.bodyHtml) {
				items.push(c);
			}
		})
		this.add(items);
	}
	SHCollection.prototype._initialDataError = function () {
		console.log("SHCollection.prototype._initialDataError", arguments);
	}

	// Streaming
	SHCollection.prototype.start = function () {
		this._sdkCollection.startStream(
			this._streamSuccess,
			this._streamError);
		return this;
	}
	SHCollection.prototype._streamSuccess = function (data) {
		console.log("SHCollection._streamSuccess", data);
	}
	SHCollection.prototype._streamError = function () {
		console.log("SHCollection.prototype._streamError", arguments);	
	}
	return SHCollection;
});
