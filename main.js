define(function(require) {
    var 
    Backbone = require('backbone'),
    SHCollection = require('streamhub-backbone/models/Collection'),
    FeedView = require('streamhub-backbone/views/FeedView');

    var Hub = function (opts) {
        this._opts = opts;
        this._collection = this._createCollectionFromOpts(opts);
        this._view = this._createViewFromOpts(opts);
        return this;
    };
    Hub.prototype._createCollectionFromOpts = function (opts) {
        return new SHCollection(opts.data).setRemote({
            sdk: opts.sdk,
            siteId: opts.collection.siteId,
            articleId: opts.collection.articleId
        });
    };
    Hub.prototype._createViewFromOpts = function (opts) {
        var viewClass = opts.view || FeedView,
            viewOpts = opts.viewOptions || {};
        var view = new viewClass(_({
            el: opts.el,
            collection: this._collection,
            contentView: opts.contentView,
            contentViewOptions: opts.contentViewOptions,
            sources: opts.sources
        }).extend(viewOpts));
        return view;
    };
    Hub.prototype.start = function () {
        return this;
    };

    Hub.Content = require('./models/Content');
    Hub.Collection = SHCollection;
    Hub.sources = require('./const/sources');
    Hub.types = require('./const/types');
    return Hub;
});
