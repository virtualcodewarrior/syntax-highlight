import xRegExp from './xregexp.js';

export { xRegExp };

export const commonRegExp = {
	multiLineCComments: xRegExp('/\\*.*?\\*/', 'gs'),
	singleLineCComments: /\/\/.*$/gm,
	singleLinePerlComments: /#.*$/gm,
	doubleQuotedString: /"([^\\"\n]|\\.)*"/g,
	singleQuotedString: /'([^\\'\n]|\\.)*'/g,
	multiLineDoubleQuotedString: xRegExp('"([^\\\\"]|\\\\.)*"', 'gs'),
	multiLineSingleQuotedString: xRegExp("'([^\\\\']|\\\\.)*'", 'gs'),
	xmlComments: xRegExp('(&lt;|<)!--.*?--(&gt;|>)', 'gs'),
	url: /\w+:\/\/[\w-./?%&=:@;#]*/g,
	phpScriptTags: { left: /(&lt;|<)\?(?:=|php)?/g, right: /\?(&gt;|>)/g, eof: true },
	aspScriptTags: { left: /(&lt;|<)%=?/g, right: /%(&gt;|>)/g },
	scriptScriptTags: { left: /(&lt;|<)\s*script.*?(&gt;|>)/gi, right: /(&lt;|<)\/\s*script\s*(&gt;|>)/gi },
};
