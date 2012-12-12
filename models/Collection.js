define(function (require) {
	var Backbone = require('backbone'),
		_ = require('underscore'),
		SHContent = require('../models/Content');

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

	// Initial data
	SHCollection.prototype._initialDataSuccess = function (data) {
		console.log("SHCollection._initialDataSuccess", data);
		var self = this,
			public = data.public,
			items = [];
		for (var id in public) {
			if (public.hasOwnProperty(id)) {
				processInitialItem(public[id]);
			}
		}
		function processInitialItem (item) {
			var c = {};
			c.id = item.id;
			c.authorId = item.content.authorId;
			c.author = self._sdkCollection.getAuthor(c.authorId);
			c.bodyHtml = item.content.bodyHtml;
			c.createdAt = item.content && item.content.createdAt || null;
			c.source_id = item.source;
			if (c.bodyHtml) {
				items.push(c);
			}
		}
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