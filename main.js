define(function(require) {
	var 
	Backbone = require('backbone'),
	SHCollection = require('streamhub-backbone/models/Collection'),
	DefaultView = require('streamhub-backbone/views/Default');

	var SHB = function (opts) {
		this._opts = opts;
		this._collection = this._createCollectionFromOpts(opts);
		this._view = this._createViewFromOpts(opts);
		return this;
	};
	SHB.prototype._createCollectionFromOpts = function (opts) {
		return new SHCollection(opts.data).setRemote({
			sdk: opts.sdk,
		  	siteId: opts.collection.siteId,
		  	articleId: opts.collection.articleId
		});
	};
	SHB.prototype._createViewFromOpts = function (opts) {
		var view = new (opts.view || DefaultView)({
			el: opts.el,
			collection: this._collection,
		});
		return view;
	};
	SHB.prototype.start = function () {
		return this;
	};

	SHB.Collection = SHCollection;
	return SHB;
});
