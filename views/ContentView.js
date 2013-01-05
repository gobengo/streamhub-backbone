define(function (require) {
    var Backbone = require("backbone"),
        Mustache = require('mustache'),
        Content = require('streamhub-backbone/models/Content'),
        ContentTemplate = require('text!streamhub-backbone/templates/Content.html');

    var ContentView = Backbone.View.extend({
        model: Content,
        tagName: "li",
        className: "hub-content",
        template: (function () {
            var t = Mustache.compile(ContentTemplate);
            return function (data) {
                data.formattedCreatedAt = formatCreatedAt(data.createdAt);
                if ( data.author && ! data.author.avatar) {
                    data.author.avatar = this.defaultAvatarUrl;
                }
                return t(data);
            }
        }()),
        events: {
        },
        initialize: function(opts) {
            this.defaultAvatarUrl = opts.defaultAvatarUrl;
            this.$el.addClass(this.className);
            if (opts.template) {
                this.template = opts.template;
            }
            this.render();
            this.listenTo(this.model, "change", this.render);
        },
        render: function() {
            var rendered = this.template(this.model.toJSON());
            this.$el.html(rendered);
        }
    });    

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

    return ContentView;
});
