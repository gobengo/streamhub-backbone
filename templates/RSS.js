define([
	'mustache',
	'text!streamhub-backbone/templates/RSS.html'],
function (Mustache, RssHtmlTmplt) {
	var tmplt = Mustache.compile(RssHtmlTmplt);
	
	return function toHtml(data) {
		return tmplt(data);
	};
});