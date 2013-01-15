define(function (require) {
var Backbone = require("backbone"),
    Mustache = require('mustache'),
    Content = require('streamhub-backbone/models/Content'),
    ContentTemplate = require('text!streamhub-backbone/templates/Content.html');

var ContentView = Backbone.View.extend(
/** @lends ContentView.prototype */
{
    /**
    ContentView can help you and your users view Content
    It will render Content into an li by default, and will
    use the Mustache template in templates/Content.html. But you
    can also specify your own `template` function when constructing.

    @class ContentView
    @param {Content} opts.model - A Content model to view
    @param {Function} opts.template - A custom template function to use instead of the default
    @param {Function} opts.defaultAvatarUrl - An avatar to use if there is not one specified for the Author of Content

    @augments Backbone.View
    @requires backbone
    @requires mustache
    */
    initialize: function(opts) {
        this.defaultAvatarUrl = opts.defaultAvatarUrl;
        this.$el.addClass(this.className);
        if (opts.template) {
            this.template = opts.template;
        }
        this.render();
        this.listenTo(this.model, "change", this.render);
    },
    // Use models/Content models
    model: Content,
    // Most displays are lists of Content
    tagName: "li",
    /** @todo provide standard way for users to specify their use-specifc class - `customClassName` */
    className: "hub-content",
    /** Default to the ContentTemplate HTML
    Templates are functions that take data and return Strings
    http://bit.ly/W22ry6 */
    template: (function () {
        var t = Mustache.compile(ContentTemplate);
        return function (data) {
            // Include default avatar for those who need it
            if ( data.author && ! data.author.avatar) {
                data.author.avatar = this.defaultAvatarUrl;
            }
            return t(data);
        };
    }()),

    // @todo add some cool events like `reply` and `like`
    events: {
    },
    
    /** Render the initial display of the Content */
    render: function() {
        var data = this.model.toJSON();
        data.formattedCreatedAt = _formatCreatedAt(data.createdAt);
        var rendered = this.template(data);
        this.$el.html(rendered);
    }
});    

/**
Convert `createdAt` time to a pleasantly human-readable String
If today: 5:12 or 5:12p
If not today: 5 Mar
@function ContentView~_formatCreatedAt

@todo Add a year if reasonable
@todo Add a nice way of users specifying their own formatter
*/
function _formatCreatedAt (date) {
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
        if (f12===0) f12 = '12';
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
