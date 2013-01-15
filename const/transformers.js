define(
/**
# transformers
When ingesting RSS feeds, StreamHub uses different
transformers to transform feed items into StreamHub Content.
Some but not all are represented here.
TODO: These should be in the SDK or otherwise abstracted
@enum transformers
@namespace transformers
@property {string} transformers.INSTAGRAM_BY_TAG - Feeds like http://instagram.com/tags/ces/feed/recent.rss
@readonly
*/
{
'INSTAGRAM_BY_TAG': "lfcore.v2.procurement.feed.transformer.instagram"
});