# Builds

`streamhub-backbone.almond.js` has a pre-loaded AMD loader as `HUB.require`. You probably want to use that unless your project uses RequireJS.

# Example Usage

    HUB.require(['streamhub-backbone'], function (Hub) {
    var app = new Hub({
        sdk: livefyreSdk,
        collection: {
            siteId: "303772",
            articleId: "prod0"
        },
        el: document.getElementById("example")
    })});
