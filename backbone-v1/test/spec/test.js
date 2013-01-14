define(['jasmine-jquery'], function () {
describe('Test', function () {
	it ("Can have tests run", function () {
		expect(true).toBe(true);
	});
	it("Can do HTML tests",function(){  
	    setFixtures('<div id="hub"></container>');  
	    $('#hub')
	    	.append('<li>So</li>')
	    	.append('<li>So</li>');
	    expect($('#hub li').length).toBe(2);  
	});
});	
});