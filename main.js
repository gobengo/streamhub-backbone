define(function(require) {
	var 
	Backbone = require('backbone'),
	SHCollection = require('streamhub-backbone/models/Collection'),
	DefaultView = require('streamhub-backbone/views/Default');

	var Hub = function (opts) {
		this._opts = opts;
		this._collection = this._createCollectionFromOpts(opts);
		this._view = this._createViewFromOpts(opts);
		return this;
	};
	Hub.prototype._createCollectionFromOpts = function (opts) {
		return new SHCollection(opts.data).setRemote({
			sdk: opts.sdk,
		  	siteId: opts.collection.siteId,
		  	articleId: opts.collection.articleId
		});
	};
	Hub.prototype._createViewFromOpts = function (opts) {
		var viewOpts = this._opts.view,
			defaultAvatarUrl,
			viewClass = DefaultView,
			viewOpts = opts.view || {};
		if (typeof(viewOpts) ==='function') {
			viewClass = viewOpts;
		} else {
			defaultAvatarUrl = viewOpts.defaultAvatarUrl;
		}
		var view = new viewClass({
			el: opts.el,
			collection: this._collection,
			defaultAvatarUrl: defaultAvatarUrl
		});
		return view;
	};
	Hub.prototype.start = function () {
		return this;
	};

	Hub.Content = require('models/Content');
	Hub.Collection = SHCollection;
	Hub.sources = require('./const/sources');
	Hub.types = require('./const/types');
	return Hub;
});
