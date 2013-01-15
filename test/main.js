/**
 * I run the test suite
 */
define('streamhub-backbone-test', function(require) {
	var jasmine = require('jasmine-html'),
		jasminejQuery = require('jasmine-jquery'),
		$ = require('jquery');
	// Test!
	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.updateInterval = 1000;

	var htmlReporter = new jasmine.HtmlReporter();

	jasmineEnv.addReporter(htmlReporter);

	jasmineEnv.specFilter = function(spec) {
		return htmlReporter.specFilter(spec);
	};

	var specs = [];
	specs.push('test/spec/test');
	specs.push('test/spec/Hub');
	specs.push('test/spec/models/Collection');
	specs.push('test/spec/models/Content');
    specs.push('test/spec/views/ContentView');
    specs.push('test/spec/views/FeedView');

	$(function(){
	require(specs, function(){
		jasmineEnv.execute();
	});
	});
});
