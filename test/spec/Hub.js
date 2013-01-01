define(['streamhub-backbone'], function (Hub) {
describe('Hub', function () {
	it ("is a function", function () {
		console.log("Hub", Hub);
		expect(Hub).toBeDefined();
	});
	xit ("can be instantiated without an SDK", function () {
		var h = new Hub();
		expect(h).toBeDefined();
	});
});	
});