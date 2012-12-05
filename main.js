define(['backbone', 'models/Collection'],
function(Backbone, SHCollection) {
	console.log("Defining SHB", arguments);
	var SHB = function (opts) {
		this._opts = opts;
		this._collection = createCollectionFromOpts(opts);
		return this;
	};
	function createCollectionFromOpts (opts) {
		return new SHCollection().bind({
		  	host: opts.host,
		  	network: opts.network,
		  	siteId: opts.siteId,
		  	articleId: opts.articleId,
		});
	}
	SHB.prototype.start = function () {
		return this;
	};
	return SHB;
});