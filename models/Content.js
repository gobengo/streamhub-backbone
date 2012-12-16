define(function (require) {
	var Backbone = require('backbone');

	var SHContent = Backbone.Model.extend({
		initialize: function (attrs) {
			var bodyHtml = attrs.bodyHtml;
			// Ensure bodyHtml wrapped in element
			if ( bodyHtml[0] !== '<') {
				var wrapper = document.createElement('div'),
					ele = document.createElement('p');
				ele.innerHTML = bodyHtml;
				wrapper.appendChild(ele);
				this.set({'bodyHtml': wrapper.innerHTML});
			}
		}
	});

	SHContent.prototype.isType = function (id) {
		return this.get('sourceId') == id;
	};
	return SHContent;
});
