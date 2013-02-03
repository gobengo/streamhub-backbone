define([
'backbone',
'mustache',
'text!streamhub-backbone/templates/Content.html',
'streamhub-backbone/views/ContentView',
'streamhub-backbone/const/sources'
], function (
Backbone,
Mustache,
ContentTemplate,
ContentView,
sources) {

var FeedView = Backbone.View.extend(
/** @lends FeedView.prototype */
{
    /**
    FeedView is the default View for Collections of Content
    It is your basic feed/list view. http://d.pr/i/UtM0
    New Content will stream in as the first children of the .el

    @class FeedView
    @param {Collection} opts.collection - A Collection of Content (see models/Collection)
    @param {Object} opts.contentViewOptions - Options to be passed to any Content Views this instantiates
           This is useful for passing custom templates for Content
    @param {Object} sources - An object to configure stuff on a per-source basis
           Supports `twitter` and `rss` sub objects with the same opts as this root level

    @augments Backbone.View
    @requires backbone
    @requires mustache

    @todo allow passing custom contentView
    */
    initialize: function (opts) {
        this._sourceOpts = opts.sources || {};
        this._contentViewOpts = opts.contentViewOptions || {};
        this.render();
        this.collection.on('add', this._addItem, this);
    },
    tagName: "div",
    className: "hub-FeedView",
    // @todo fire rich events for folks to listen to
    events: {
    },

    /**
    Render the initial display of the Collection, including
    any initially set Content */
    render: function () {
        var self = this;
        this.$el.html('');
        this.$el.addClass(this.className);
        this.collection.forEach(function(item, index, collection) {
            self._addItem(item, collection, {});
        });
    }
});

/**
Handle a new piece of Content being added to the Collection
Stream it into the beginning of the parent .el */
FeedView.prototype._addItem = function(item, collection, opts) {
    var self = this,
        newItem = $(document.createElement('div')),
        data = item.toJSON();

    if ( ! data.author) {
        // @TODO: These may be deletes... handle them.
        console.log("FeedView: No author for Content, skipping");
        return;
    }

    // items may not always be Content
    newItem.addClass('hub-item');

    // Interleave configured default opts with source-specific opts
    function _getContentViewOpts (content) {
        var opts = {},
            configuredOpts = _(opts).extend(self._contentViewOpts),
            perSourceOpts;
        if (content.get('source')==sources.TWITTER) {
            return _(configuredOpts).extend(self._sourceOpts.twitter||{});
        }
        if (content.get('source')==sources.RSS) {
            return _(configuredOpts).extend(self._sourceOpts.rss||{});
        }
        return configuredOpts;
    }

    // Create the ContentView so we can look at it and stuff!
    // render it in this newItem element
    var cv = new ContentView(_.extend({
        model: item,
        el: newItem
    }, _getContentViewOpts(item)));
    /**
    Put the newItem element in the DOM so we're done
    @todo do this in a more clever way to take into account
          the Collection's .comparator */
    var index = this.collection.indexOf(item);
    var prev = this.collection.at(index-1);
    var prevEl = prev ? this.$el.find('[data-hub-content-id="'+prev.get('id')+'"]').closest('.hub-item') : null;
    if (prevEl && prevEl.length > 0) {
        newItem.insertBefore(prevEl);
    } else {
        this.$el.append(newItem);
    }
};

return FeedView;
});
