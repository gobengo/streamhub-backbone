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
@property {string} sources.STREAMHUB - Stuff Users submit to StreamHub directly (e.g. comments)
@property {string} sources.RSS - Stuff from an RSS Feed
@property {string} sources.TWITTER - Stuff from twitter
@readonly
*/
{
'STREAMHUB': '5',
'RSS': '13',
'TWITTER': '1'
});