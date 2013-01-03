define(function (require) {
    var Backbone = require("backbone"),
        Mustache = require('mustache'),
        ContentTemplate = require('text!templates/Content.html');

    var ContentView = Backbone.View.extend({
        tagName: "li",
        className: "hub-content",
        template: Mustache.compile(ContentTemplate),
        events: {
        },
        initialize: function() {
            this.$el.addClass(this.className);
            this.render();
            this.listenTo(this.model, "change", this.render);
        },
        render: function() {
            var rendered = this.template(this.model.toJSON());
            this.$el.html(rendered);
        }
    });    

    return ContentView;
});
