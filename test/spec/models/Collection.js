define(['models/Collection', 'jasmine-jquery'],
function (Collection, jasminejQuery) {
describe('Collection', function () {
	var CONFIG = {};
	CONFIG.siteId = 303772;
	CONFIG.articleId = "prod0";

	var collectionFixture = [{"id":"tweet-284734706455560192@twitter.com","authorId":"43765496@twitter.com","author":{"avatar":"http://a0.twimg.com/profile_images/1265228110/03-07-2011_normal.png","tags":[],"profileUrl":"http://twitter.com/#!/Livefyre","displayName":"Livefyre","id":"43765496@twitter.com"},"bodyHtml":"<p>::blushes:: Let us know what you think! RT <a vocab=\"http://schema.org\" typeof=\"Person\" rel=\"nofollow\" resource=\"acct:137461486\" data-lf-handle=\"\" data-lf-provider=\"twitter\" property=\"url\" target=\"_blank\" class=\"fyre-mention fyre-mention-twitter\">@<span property=\"name\">donvodki</span></a>: <a vocab=\"http://schema.org\" typeof=\"Person\" rel=\"nofollow\" resource=\"acct:43765496\" data-lf-handle=\"\" data-lf-provider=\"twitter\" property=\"url\" target=\"_blank\" class=\"fyre-mention fyre-mention-twitter\">@<span property=\"name\">Livefyre</span></a> yay..thats pretty sexy. ill give it a try &amp; of course make some comments :P</p>","createdAt":1356721038,"source":"1","type":"0"},{"id":"tweet-284778687633694720@twitter.com","authorId":"43765496@twitter.com","author":{"avatar":"http://a0.twimg.com/profile_images/1265228110/03-07-2011_normal.png","tags":[],"profileUrl":"http://twitter.com/#!/Livefyre","displayName":"Livefyre","id":"43765496@twitter.com"},"bodyHtml":"<p>:) RT <a vocab=\"http://schema.org\" typeof=\"Person\" rel=\"nofollow\" resource=\"acct:221905427\" data-lf-handle=\"\" data-lf-provider=\"twitter\" property=\"url\" target=\"_blank\" class=\"fyre-mention fyre-mention-twitter\">@<span property=\"name\">annedreshfield</span></a>: Loved the holiday card <a vocab=\"http://schema.org\" typeof=\"Person\" rel=\"nofollow\" resource=\"acct:43765496\" data-lf-handle=\"\" data-lf-provider=\"twitter\" property=\"url\" target=\"_blank\" class=\"fyre-mention fyre-mention-twitter\">@<span property=\"name\">Livefyre</span></a> sent--made my day!</p>","createdAt":1356731526,"source":"1","type":"0"},{"authorId":"43765496@twitter.com","author":{"avatar":"http://a0.twimg.com/profile_images/1265228110/03-07-2011_normal.png","tags":[],"profileUrl":"http://twitter.com/#!/Livefyre","displayName":"Livefyre","id":"43765496@twitter.com"},"bodyHtml":"<p><a vocab=\"http://schema.org\" typeof=\"Person\" rel=\"nofollow\" resource=\"acct:5660312\" data-lf-handle=\"\" data-lf-provider=\"twitter\" property=\"url\" target=\"_blank\" class=\"fyre-mention fyre-mention-twitter\">@<span property=\"name\">NickKellet</span></a> Hi Nick, can you email us at support<a vocab=\"http://schema.org\" typeof=\"Person\" rel=\"nofollow\" resource=\"acct:43765496\" data-lf-handle=\"\" data-lf-provider=\"twitter\" property=\"url\" target=\"_blank\" class=\"fyre-mention fyre-mention-twitter\">@<span property=\"name\">Livefyre</span></a>.com with a link to the photo that is appearing in Linkback?</p>","createdAt":1356988697,"source":"1","type":"0"}]; 
	
	it ("is defined", function () {
		expect(Collection).toBeDefined();
	});
	it ("can be constructed", function () {
		var c = new Collection();
		expect(c instanceof Collection).toBe(true);
	});
	it ("can be constructed with empty data", function () {
		var c = new Collection([]);
		expect(c.length).toBe(0);
	});
	describe ("with preset data", function () {
		beforeEach(function () {
			this.collection = new Collection(collectionFixture);
		})
		it ("should have a length", function () {
			expect(this.collection.length).toBe(3);
		});
	});
});	
});