define([
'backbone',
'mustache',
'text!streamhub-backbone/templates/Content.html',
'streamhub-backbone/views/ContentView'
], function (
Backbone,
Mustache,
ContentTemplate,
ContentView) {
	var	DefaultView = Backbone.View.extend({
		"tagName": "div",
		"className": "hub-backbone",
		events: {
		},
		initialize: function (opts) {
			this._contentViewOpts = {
				defaultAvatarUrl: opts.defaultAvatarUrl
			}
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

	DefaultView.prototype._addItem = function(item, collection, opts) {
		var newItem = $(document.createElement('div')),
			data = item.toJSON();

		if ( ! data.author) {
			// TODO: These may be deletes... handle them.
			console.log("DefaultView: No author for Content, skipping");
			return;
		}

		newItem.addClass('hub-item')

		var cv = new ContentView(_.extend({
			model: item,
			el: newItem
		}, this._contentViewOpts));

		if (collection.length - collection.indexOf(item)-1===0) {
			this.$el.prepend(newItem);
		} else {
			this.$el.append(newItem);
		}
	}
	return DefaultView;
});
