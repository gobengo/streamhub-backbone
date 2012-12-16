define(function(require) {
	var Backbone = require('backbone'),
		SHCollection = require('./models/Collection'),
		DefaultView = require('./views/Default');

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
		var view = new (opts.view || DefaultView)({
			el: opts.el,
			collection: this._collection,
		});
		return view;
	};
	Hub.prototype.start = function () {
		return this;
	};

	Hub.Collection = SHCollection;
	Hub.sources = require('./const/sources');
	Hub.types = require('./const/types');
	return Hub;
});
