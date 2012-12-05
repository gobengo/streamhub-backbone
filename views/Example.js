define(['backbone'], function (Backbone) {
	var ExampleView = Backbone.View.extend({
		"tagName": "div",
		"className": "shb-example",
		events: {
			'all': function () { console.log('ExampleView event', arguments); }
		},
		initialize: function () {
			this.render();
			this.collection.on('add', this._addItem, this);
		},
		render: function () {
			var self = this;
			this.$el.addClass(this.className);
			this.collection.forEach(function(item, index, collection) {
				self._addItem(item, collection, {})
			});
		}
	});
	ExampleView.prototype._addItem = function(item, collection, opts) {
		console.log('ExampleView._addItem', opts.index, item);
		var newItem = $(document.createElement('div'));
		newItem
		  .addClass('shb-content')
		  .append('<p class="shb-byline"><span class="shb-author">'+item.get('author').displayName+'</span></p>')
		  .append(item.get('bodyHtml'));
		this.$el.append(newItem);
	}
	return ExampleView;
});