define(function (require) {
	var Backbone = require('backbone'),
        sources = require('streamhub-backbone/const/sources'),
        types = require('streamhub-backbone/const/types'),
        transformers = require('streamhub-backbone/const/transformers');

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
                attrs.bodyHtml = htmlOrObj;
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
        var c = d.content,
            attrs,
            attachments = _getAttachmentsFromState(d);

        attrs = {
            id: d.id ,
            event: d.event,
            bodyHtml: c.bodyHtml,
            ancestorId: c.ancestorId,
            annotations: c.annotations,
            authorId: c.authorId,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            replaces: c.replaces || null,
            parentId: c.parentId || null,
            source: d.source,
            transport: d.transport,
            type: d.type,
            vis: d.vis
        };
        if (c.author) {
            attrs.author = c.author;
        }
        if (attachments) {
            attrs.attachments = attachments;
        }
        return new Content(attrs);
    };
    function _getAttachmentsFromState (s) {
        // Only do this for RSS for now
        if (s.source==sources.RSS) return _getAttachmentFromRssState(s);
        if (s.type==types.OEMBED) return _getAttachmentFromOembedState(s);
        function _getAttachmentFromRssState (s) {
            var feedEntry = s.content.feedEntry;
            if ( ! feedEntry ) return;

            if (feedEntry.transformer == transformers.INSTAGRAM_BY_TAG) {
                // Add oEmbed photo attachment for Instagram photo
                return [{
                    version: '1.0',
                    type: 'photo',
                    provider: 'instagram',
                    width: '612',
                    height: '612',
                    url: feedEntry.link
                }];
            } 
        }
        function _getAttachmentFromOembedState (s) {
            return [s.content.oembed];
        }
    }
    Content.prototype._handleSdkState = function (s) {
        if (s.type==types.OEMBED) this._handleSdkOembedState(s);
    }
    Content.prototype._handleSdkOembedState = function (s) {
        var newAttachments = _getAttachmentsFromState(s),
            oldAttachments = this.get('attachments') || [];
        if (newAttachments) {
            this.set('attachments', oldAttachments.concat(newAttachments));
        }
    }

	return Content;
});
