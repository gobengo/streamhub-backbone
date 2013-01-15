define(
/**
# sources
The StreamHub APIs use enumerations to define
the source of content. All sources should be
in this enumeration.
TODO: These should be in the SDK
      That will be released in Jan/Feb 2013
@enum sources
@namespace sources
@property {String} sources.STREAMHUB - Stuff Users submit to StreamHub directly (e.g. comments)
@property {String} sources.RSS - Stuff from an RSS Feed
@property {String} sources.TWITTER - Stuff from twitter
@readonly
*/
{
STREAMHUB: '5',
RSS: '13',
TWITTER: '1'
});