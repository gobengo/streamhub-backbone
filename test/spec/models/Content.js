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
        });
    });
});