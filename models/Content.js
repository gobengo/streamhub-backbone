define(['models/Content'], function (SHContent) {
	var SHContent = Backbone.Model.extend({

	});

	(function test () {
		var c = new SHContent({
			bodyHtml: "<p>I am Comment</p>"
		});
	}());
	return SHContent;
});