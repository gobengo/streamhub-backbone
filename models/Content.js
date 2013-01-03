define(function (require) {
	var Backbone = require('backbone');

	var Content = Backbone.Model.extend({
        /*
         * Can be passed a string of bodyHtml
         * or normal attr Object
         */
        constructor: function (htmlOrObj) {
            var attrs = {};
            if (typeof(htmlOrObj)==='Object') {
                attrs = htmlOrObj;
            } else {
                attrs.html = htmlOrObj;
            }
            Backbone.Model.prototype.constructor.call(this, attrs);
        },
		initialize: function (attrs) {
		}
	});
	
	return Content;
});
