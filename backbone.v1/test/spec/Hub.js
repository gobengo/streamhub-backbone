define(['streamhub-backbone'],
function (Hub) {
describe('Hub', function () {
	it ("is a function", function () {
		expect(Hub).toBeDefined();
	});
	xit ("can be instantiated without an SDK", function () {
		var h = new Hub();
		expect(h).toBeDefined();
	});
	it ("has Hub.Content", function () {
		expect(Hub.Content).toBeDefined();
	});
});	
});