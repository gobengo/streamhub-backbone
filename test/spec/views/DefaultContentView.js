define(['views/DefaultContentView', 'models/Content'],
function (DefaultContentView, Content) {
    describe ("Content model", function () {
        it ("Can be constructed", function () {
            var c = new Content({});
            expect(c).toBeDefined;
            expect(c instanceof Content).toBe(true);
        });
        it ("can be passed bodyHtml as a single string param", function () {
            var html = "<p>StreamHub</p>",
                c = new Content(html);
            expect(c.get('html')).toBe(html);
        });
    });
    describe ("DefaultContentView", function () {
        it ("can be constructed", function () {
           var c = new Content({
               }),
               cv = new DefaultContentView({
                   model: c,
               });
           expect(cv).toBeDefined;
           expect(cv instanceof DefaultContentView).toBe(true);
        });
    });
});
