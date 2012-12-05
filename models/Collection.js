define(['models/Content'], function (SHContent) {
	var SHCollection = Backbone.Collection.extend({
		model: SHContent
	});
	SHCollection.prototype.bind = function (collectionInfo) {
		this.remote = collectionInfo;
		return this;
	};

	return SHCollection;
});