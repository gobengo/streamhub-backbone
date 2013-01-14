define([
'models/Collection',
'streamhub-backbone/models/Content',
'jasmine-jquery',
'test/fixtures/fyre.conv.sdk',
'test/fixtures/sdkCollectionData'],
function (Collection, Content, jasminejQuery, livefyreSdk, sdkCollectionData) {
describe('Collection', function () {
	var CONFIG = {};
	CONFIG.siteId = 303772;
	CONFIG.articleId = "prod0";

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
			this.collection = new Collection(sdkCollectionData);
		})
		it ("should have a length", function () {
			expect(this.collection.length).toBe(4);
		});

	});
	describe ("when configured with remote Collection", function () {
		beforeEach(function () {
			this.collection = new Collection()

			this.onAddSpy = jasmine.createSpy('onAdd');
			this.collection.on('add', this.onAddSpy);

			this.collection.setRemote({
				sdk: livefyreSdk,
				siteId: CONFIG.siteId,
				articleId: CONFIG.articleId
			});
		});
		it ("should fire sdkData events on initial data from StreamHub", function () {
			spy = jasmine.createSpy('onSdkDataCallback')
			var c = this.collection;
			c.on('sdkData', spy);
			c._initialDataSuccess(livefyreSdk.dataFixture);
			expect(spy).toHaveBeenCalled();
		});
		it ("should fire add event on initial data", function () {
			expect(this.onAddSpy).toHaveBeenCalled();
			// If all have .html, then we assume they're Content
			this.onAddSpy.argsForCall.forEach.call(this, function (args) {
				expect(args[0].get('html').toBeDefined())
			})
		})
		it ("should fire sdkData events on streamed data from StreamHub", function () {
			spy = jasmine.createSpy('onSdkDataCallback')
			var c = this.collection;
			c.on('sdkData', spy);
			c._streamSuccess(livefyreSdk.dataFixture);
			expect(spy).toHaveBeenCalled();
		});
		// TODO
		xit ("should fire add event on streamed Content", function () {
			spy = jasmine.createSpy('onAddCallback')
			var c = this.collection;
			c.on('add', spy);
			livefyreSdk.dataFixture.public.test = livefyreSdk.dataFixture.public['26366616']
			c._streamSuccess(livefyreSdk.dataFixture);
			expect(spy).toHaveBeenCalled();
		});
		describe (".getAuthor method", function () {
			it ("should return an author object", function () {
				var a = this.collection.getAuthor(livefyreSdk.authorIdFixture);
				expect(a).toEqual(jasmine.any(Object));
			});
			it ("should return falsy if pass unknown authorId", function () {
				var a = this.collection.getAuthor(null);
				expect(a).toBeFalsy();
			})
		});
	});
});	
});
