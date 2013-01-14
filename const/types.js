define(
/**
The StreamHub APIs use enumerations to define
the type of message sent down the wire. All types
should be in this enumeration.
TODO: These should be in the SDK
      That will be released in Jan/Feb 2013
@enum types
@namespace types
@property {Number} types.CONTENT - The good stuff. Juicy Content like comments
@property {Number} types.OPINE - A user's opinion or something
@property {Number} types.SHARE - TODO: I don't know yet.
@property {Number} types.OEMBED - A new attachment
@readonly
*/
{
CONTENT: 0,
OPINE: 1,
SHARE: 2,
OEMBED: 3
})