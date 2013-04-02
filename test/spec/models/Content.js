define(['views/ContentView', 'models/Content', 'test/fixtures/sdkContentData'],
function (ContentView, Content, sdkContentData) {
    describe ("Content model", function () {
        it ("can be passed bodyHtml as a single string param", function () {
            var html = "<p>StreamHub</p>",
                c = new Content(html);
            expect(c instanceof Content).toBe(true);
            expect(c.get('bodyHtml')).toBe(html);
        });
        it ("can be passed a Content object from the SDK", function () {
            var c = new Content.fromSdk(sdkContentData);
            expect(c instanceof Content).toBe(true);
            expect(c.get('id')).toBe(sdkContentData.id);
        });
        describe ("from raw html", function () {
          beforeEach(function () {
            this.c = new Content("<p>Woo</p>");
          });
          it ('should not have an id', function () {
              expect(this.c.get('id')).toBeFalsy();
          });
        });
        describe ("constructed .fromSdk", function () {
          beforeEach(function () {
            this.c = new Content.fromSdk(sdkContentData);
          });
          it ("should have an id", function () {
              expect(this.c.get('id')).toBeTruthy();
          });
          it ("should have a feedEntry property if the source data does", function() {
        	  var mockData = {"id":"29a2563b-5b2e-43f4-8105-c79e80085d9a","source":13,"type":0,"event":1364840050214374,"vis":1,"transport":1,"content":{"replaces":"","feedEntry":{"transformer":"lfcore.v2.procurement.feed.transformer.default","feedType":1,"description":"<img src=\"/blogconference/fabb-attendee-spotlight-krystal-bick-of-this-time-tomorrow/jcr:content/cn_page_metadata/search.rendition.searchThumb.krystal_bick_interview.jpg\" /> \n            \n        In this FABB Attendee Spotlight, Krystal Bick of This Time Tomorrow tells Lucky all about the blogging life, from how she got started to where she gets inspired.","pubDate":1364840050,"title":"Fabb Attendee Spotlight: Krystal Bick of This Time Tomorrow","channelId":"http://www.luckymag.com/feed/rss/fabb.rss.xml","link":"http://www.luckymag.com/blogconference/fabb-attendee-spotlight-krystal-bick-of-this-time-tomorrow","id":"29a2563b-5b2e-43f4-8105-c79e80085d9a","createdAt":1364840050},"bodyHtml":"<img src=\"/blogconference/fabb-attendee-spotlight-krystal-bick-of-this-time-tomorrow/jcr:content/cn_page_metadata/search.rendition.searchThumb.krystal_bick_interview.jpg\" /> \n            \n        In this FABB Attendee Spotlight, Krystal Bick of This Time Tomorrow tells Lucky all about the blogging life, from how she got started to where she gets inspired.","id":"29a2563b-5b2e-43f4-8105-c79e80085d9a","authorId":"f3f3bc169eed11d84cfaaa0e25554851","parentId":"","updatedAt":1364840050,"annotations":{},"createdAt":1364840050,"ancestorId":"29a2563b-5b2e-43f4-8105-c79e80085d9a","author":{"tags":[],"profileUrl":"http://www.luckymag.com/","displayName":"www.luckymag.com","id":"f3f3bc169eed11d84cfaaa0e25554851"}},"pageIdx":"head"};
        	  var c = new Content.fromSdk(mockData);
        	  expect(c.get("feedEntry")).toBe(mockData.content.feedEntry);
          });
        });
    });
});