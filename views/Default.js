define([
'backbone',
'mustache',
'text!../templates/Content.html'
], function (
Backbone,
Mustache,
ContentTemplate) {
	var	DefaultView = Backbone.View.extend({
		"tagName": "div",
		"className": "hub-backbone",
		events: {
		},
		initialize: function (opts) {
			this.defaultAvatarUrl = opts.defaultAvatarUrl;
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
			console.log("DefaultView: No author for Content, skipping");
			return;
		}
		if ( data.author && ! data.author.avatar) {
			data.author.avatar = this.defaultAvatarUrl;
		}

		function formatCreatedAt (date) {
			var d = new Date(date),
				monthN = d.getMonth(),
				months;
			months = ['Jan','Feb','Mar','Apr','May',
					  'Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
			// TODO: Show year when appropriate
			var ret = "{day} {month}"
				.replace("{day}", d.getDate())
				.replace("{month}", months[monthN]);
			return ret;
		}
		data.formattedCreatedAt = formatCreatedAt(data.createdAt);

		newItem
		  .addClass('hub-item')
		  .append(Mustache.compile(ContentTemplate)(data));
		
		if (collection.length-collection.indexOf(item)-1===0) {
			this.$el.prepend(newItem);
		} else {
			this.$el.append(newItem);
		}
	}
	return DefaultView;
});