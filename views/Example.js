define(['backbone'], function (Backbone) {
	var ExampleView = Backbone.View.extend({
		"tagName": "div",
		"className": "shb-example",
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
	return ExampleView;
});