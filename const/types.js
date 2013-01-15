define(
/**
The StreamHub APIs use enumerations to define
the type of message sent down the wire. All types
should be in this enumeration.
TODO: These should be in the SDK
      That will be released in Jan/Feb 2013
@enum types
@namespace types
@property {string} types.CONTENT - The good stuff. Juicy Content like comments
@property {string} types.OPINE - A user's opinion or something
@property {string} types.SHARE - TODO: I don't know yet.
@property {string} types.OEMBED - A new attachment
@readonly
*/
{
'CONTENT': '0',
'OPINE': '1',
'SHARE': '2',
'OEMBED': '3'
});