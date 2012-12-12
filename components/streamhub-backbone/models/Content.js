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

	(function test () {
		var c = new SHContent({
			bodyHtml: "<p>I am Comment</p>"
		});
	}());
	return SHContent;
});