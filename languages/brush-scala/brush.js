var BrushBase = require('brush-base');
var regexLib = require('syntaxhighlighter-regex').commonRegExp;

function Brush() {
  // Contributed by Yegor Jbanov and David Bernard.

  var keywords = 'val sealed case def true trait implicit forSome import match object null finally super ' +
    'override try lazy for var catch throw type extends class while with new final yield abstract ' +
    'else do if return protected private this package false';

  var keyops = '[_:=><%#@]+';

  this.regexList = [
    {
      regex: regexLib.singleLineCComments,
      css: 'comments'
    },
    {
      regex: regexLib.multiLineCComments,
      css: 'comments'
    },
    {
      regex: regexLib.multiLineSingleQuotedString,
      css: 'string'
    },
    {
      regex: regexLib.multiLineDoubleQuotedString,
      css: 'string'
    },
    {
      regex: regexLib.singleQuotedString,
      css: 'string'
    },
    {
      regex: /0x[a-f0-9]+|\d+(\.\d+)?/gi,
      css: 'value'
    },
    {
      regex: new RegExp(this.getKeywords(keywords), 'gm'),
      css: 'keyword'
    },
    {
      regex: new RegExp(keyops, 'gm'),
      css: 'keyword'
    }
		];
}

Brush.prototype = new BrushBase();
Brush.aliases = ['scala'];
module.exports = Brush;