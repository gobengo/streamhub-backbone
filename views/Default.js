define([
'backbone',
'mustache',
'text!streamhub-backbone/templates/Content.html',
'streamhub-backbone/views/ContentView',
'streamhub-backbone/const/sources'
], function (
Backbone,
Mustache,
ContentTemplate,
ContentView,
sources) {
	var	DefaultView = Backbone.View.extend({
		"tagName": "div",
		"className": "hub-backbone",
		events: {
		},
		initialize: function (opts) {
			this._sourceOpts = opts.sources || {};
			this._contentViewOpts = opts._contentViewOptions || {};
			this.render();
			this.collection.on('add', this._addItem, this);
		},
		render: function () {
			var self = this;
			this.$el.html('');
			this.$el.addClass(this.className);
			this.collection.forEach(function(item, index, collection) {
				self._addItem(item, collection, {})
			});
		}
	});

	DefaultView.prototype._addItem = function(item, collection, opts) {
		var self = this,
			newItem = $(document.createElement('div')),
			data = item.toJSON();

		if ( ! data.author) {
			// TODO: These may be deletes... handle them.
			console.log("DefaultView: No author for Content, skipping");
			return;
		}
		newItem.addClass('hub-item')

		function _getContentViewOpts (content) {
			var opts = {},
				configuredOpts = _(opts).extend(self._contentViewOpts),
				perSourceOpts;
			if (content.get('source')==sources.TWITTER) {
				return _(configuredOpts).extend(self._sourceOpts['twitter']||{});
			}
			if (content.get('source')==sources.RSS) {
				return _(configuredOpts).extend(self._sourceOpts['rss']||{});
			}
			return configuredOpts;
		}
		var cv = new ContentView(_.extend({
			model: item,
			el: newItem
		}, _getContentViewOpts(item)));

		if (collection.length - collection.indexOf(item)-1===0) {
			this.$el.prepend(newItem);
		} else {
			this.$el.append(newItem);
		}
	}
	return DefaultView;
});
