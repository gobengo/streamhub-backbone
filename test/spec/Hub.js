define(['streamhub-backbone'], function (Hub) {
describe('Hub', function () {
	it ("Can have tests run", function () {
		expect(true).toBe(true);
	});
	it ("is a function", function () {
		console.log("Hub", Hub);
		expect(Hub).toBeDefined();
	});
});	
});