define(['backbone'], function (Backbone) {
	// TODO!
	var CollectionView = Backbone.View.extend({
		"tagName": "div",
		"className": "shb-collection",
		events: {},
		initialize: function () {
			this.render();
		},
		render: function () {
			var self = this;
			this.collection.forEach(function(item, index, collection) {
				self.$el.append(item.get('bodyHtml'));
			});
		}
	});
	return CollectionView;
});