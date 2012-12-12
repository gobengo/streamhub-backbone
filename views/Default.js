define(['backbone', 'mustache', 'text!../templates/Content.html'],
function (Backbone, Mustache, ContentTemplate) {
	DEFAULT_AVATAR_URL = 'http://placehold.it/48&text=avatar';
	var DefaultView = Backbone.View.extend({
		"tagName": "div",
		"className": "shb-example",
		events: {
			'all': function () { console.log('ExampleView event', arguments); }
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
		console.log('ExampleView._addItem', opts.index, item.toJSON());
		var newItem = $(document.createElement('div')),
			json = item.toJSON();
		if ( ! json.author.avatar) {
			json.author.avatar = this.defaultAvatarUrl;
		}
		newItem
		  .addClass('shb-item')
		  .append(Mustache.compile(ContentTemplate)(json))
		this.$el.append(newItem);
	}
	return DefaultView;
});