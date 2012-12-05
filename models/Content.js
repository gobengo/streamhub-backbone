define(['backbone'], function (Backbone) {
	var SHContent = Backbone.Model.extend({

	});

	(function test () {
		var c = new SHContent({
			bodyHtml: "<p>I am Comment</p>"
		});
	}());
	return SHContent;
});