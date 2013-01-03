define(function (require) {
	var Backbone = require('backbone');

	var Content = Backbone.Model.extend({
        /*
         * Can be passed a string of bodyHtml
         * or normal attr Object
         */
        constructor: function (htmlOrObj) {
            var attrs = {};
            if (typeof(htmlOrObj)==='object') {
                attrs = htmlOrObj;
            } else {
                attrs.html = htmlOrObj;
            }
            Backbone.Model.prototype.constructor.call(this, attrs);
        },
		initialize: function (attrs) {
		}
	});

    /*
     * Create a piece of Content from the JS SDK response format
     */
    Content.fromSdk = function (d) {
        var c = d.content;
        return new Content({
            id: d.id ,
            event: d.event,
            html: c.bodyHtml,
            ancestorId: c.ancestorId,
            annotations: c.annotations,
            authorId: c.authorid,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            replaces: c.replaces || null,
            parentId: c.parentId || null,
            source: d.source,
            transport: d.transport,
            type: d.type,
            vis: d.vis
        });
    };
	
	return Content;
});
