define([
	'mustache',
	'text!streamhub-backbone/templates/Tweet.html'],
function (Mustache, TweetHtml) {
	var tweetIconUrl = "data:image/png;base64,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";
	var twitterHtml = Mustache.compile(TweetHtml);
	return function (data) {
		data.tweetId = tweetIdFromContentId(data.id);
		data.author = data.author || {};
		data.author.twitterUserId = twitterUserIdFromAuthor(data.author);
		data['.tweetIconUrl'] = tweetIconUrl;
		if (data.attachments && data.attachments.length > 0 ) {
			debugger;
		}
		return twitterHtml(data);
	};

	// StreamHub Content IDs are global accross all sources of Content,
	// so we need to extract the Tweet ID from it to give twitter web intents
	// what they expect
	// 'tweet-12512312@twitter.com' -> '12512312'
	function tweetIdFromContentId (contentId) {
		if ( ! contentId) {
			return;
		}
		var idParts = contentId.split('@twitter.com'),
			tweetId = ( idParts.length > 0 ) && idParts[0].substring('tweet-'.length);
		return tweetId;
	}

	// StreamHub Author IDs are global accross all sources of Content,
	// so we need to extract the Twitter User ID from it to give twitter web intents
	// what they expect
	// '123@twitter.com' -> '123'
	function twitterUserIdFromAuthor (author) {
		if ( ! author) {
			return;
		}
		var authorId = author.id,
			idParts = authorId && authorId.split('@'),
			twitterUserId = ( idParts.length > 0 ) && idParts[0];
		return twitterUserId;
	}
});