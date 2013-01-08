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
            var data = this.model.toJSON();
            data.formattedCreatedAt = formatCreatedAt(data.createdAt);
            var rendered = this.template(data);
            this.$el.html(rendered);
        }
    });    

    function formatCreatedAt (date) {
        var d = new Date(date*1000),
            monthN = d.getMonth(),
            months;
        months = ['Jan','Feb','Mar','Apr','May',
                  'Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
        // If today, use time
        if (_dateIsToday(d)) {
            return _12hourTime(d);
        } else {
            // TODO: Show year when appropriate
            return "{day} {month}"
            .replace("{day}", d.getDate())
            .replace("{month}", months[monthN]);
        }
        function _12hourTime (date) {
            var f24 = d.getHours(),
                f12 = f24 % 12,
                ret = ""+f12,
                minutes = d.getMinutes(),
                ampm='';
            if (f12==0) f12 = '12';
            if (minutes<=9) minutes = "0"+minutes;
            if (f24 >= 12) ampm = 'p';
            return "{hour}:{min}{ampm}"
                .replace("{hour}", f12)
                .replace("{min}", minutes)
                .replace("{ampm}", ampm);
        }
        function _dateIsToday (date) {
            var today = new Date();
            return (date.getDate()==today.getDate() &&
                    date.getMonth()==today.getMonth() &&
                    date.getFullYear()==today.getFullYear());
        }
    }

    return ContentView;
});
