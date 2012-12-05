define(['backbone', 'models/Collection', 'views/Example'],
function(Backbone, SHCollection, ExampleView) {
	console.log("Defining SHB", arguments);
	var SHB = function (opts) {
		this._opts = opts;
		this._collection = this._createCollectionFromOpts(opts);
		this._view = this._createViewFromOpts(opts);
		return this;
	};
	SHB.prototype._createCollectionFromOpts = function (opts) {
		return new SHCollection(opts.data).bind({
		  	host: opts.host,
		  	network: opts.network,
		  	siteId: opts.siteId,
		  	articleId: opts.articleId,
		});
	}
	SHB.prototype._createViewFromOpts = function (opts) {
		var view = new ExampleView({
			el: opts.el,
			collection: this._collection
			//contentView: DefaultContentView
		});
		return view;
	}
	SHB.prototype.start = function () {
		return this;
	};
	return SHB;
});