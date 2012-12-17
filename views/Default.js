define(function (require) {
	var
	Backbone = require('backbone'),
	Mustache = require('mustache'),
	ContentTemplate = require('text!../templates/Content.html'),
	DEFAULT_AVATAR_URL = 'http://placehold.it/48&text=avatar',

	DefaultView = Backbone.View.extend({
		"tagName": "div",
		"className": "shb-example",
		events: {
		},
		initialize: function (opts) {
			this.defaultAvatarUrl = opts.defaultAvatarUrl || DEFAULT_AVATAR_URL;
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

		if ( data.author && ! data.author.avatar) {
			data.author.avatar = this.defaultAvatarUrl;
		}
		newItem
		  .addClass('shb-item')
		  .append(Mustache.compile(ContentTemplate)(data))
		this.$el.append(newItem);
	}
	return DefaultView;
});