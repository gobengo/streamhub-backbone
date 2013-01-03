define(function (require) {
    var Backbone = require("backbone");

    var DefaultContentView = Backbone.View.extend({
        tagName: "li",
        className: "hub-content",
        events: {
        },
        initialize: function() {
            this.render();
            this.listenTo(this.model, "change", this.render);
        },
        render: function() {
        }
    });    

    return DefaultContentView;
});
