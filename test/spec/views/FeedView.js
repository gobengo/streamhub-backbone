define([
    'views/FeedView',
    'models/Collection',
    'test/fixtures/sdkContentData',
    'test/fixtures/sdkCollectionData',
    'mustache'],
function (FeedView, Collection, sdkContentData, sdkCollectionData, Mustache) {
    describe ("FeedView", function () {
        // Set up HTML fixture
        beforeEach(function () {
            setFixtures('<div id="hub"></container>');
            this.$el = $('#hub');
        });
        // Users should be able to create Content from
        // items returned from the StreamHub JavaScript SDK
        describe ("with model fromSdk", function () {
          beforeEach(function () {
            this.collection = new Collection(sdkCollectionData); 
          });
          testBasics();
          testCustomTemplates();
        });
        function testBasics () {
            beforeEach(function () {
                this.dv = new FeedView({
                    collection: this.collection,
                    el: '#hub'
                });
            });
            it ("is defined", function () {
                expect(this.dv).toBeDefined();
            });
            it ("has items", function () {
                expect(this.$el.find('.hub-item').length > 0).toBe(true);
            });
        }
        function testCustomTemplates () {
            beforeEach(function () {
                this.dv = new FeedView({
                    collection: this.collection,
                    el: '#hub',
                    sources: {
                        twitter: {
                            template: Mustache.compile("<p class='test-tweet'>Tweet</p>")
                        },
                        rss: {
                            template: Mustache.compile("<p class='test-rss'>RSS</p>")
                        }
                    }
                });
            });
            it ("uses the tweet template", function () {
                var tweets = this.$el.find('.test-tweet');
                expect(tweets.length).toBeGreaterThan(0);
            });
            it ("uses the rss template", function () {
                var rss = this.$el.find('.test-rss');
                expect(rss.length).toBeGreaterThan(0);
            });
        }
    });
});
