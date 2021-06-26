import BrushBase from '../brush-base/brush-base.js';
import { commonRegExp as regexLib } from '../../utilities/syntaxhighlighter-regex/syntaxhighlighter-regex.js';
import xRegExp from '../../utilities/syntaxhighlighter-regex/xregexp.js';

function Brush() {
	const keywords = `arguments as async await break case catch class const continue 
		debugger default delete do else enum eval export extends false finally 
		for from function if implements import in Infinity instanceof  
		interface let NaN new null of package private protected public 
		return self static super switch 
		this throw true try typeof undefined var void while with yield`;

	this.regexList = [{
		regex: xRegExp('"([^\\\\"\\n]|\\\\[\\s\\S])*"', 'gs'),
		css: 'string',
	}, {
		regex: xRegExp("'([^\\\\'\\n]|\\\\[\\s\\S])*'", 'gs'),
		css: 'string',
	}, {
		regex: xRegExp("`([^\\\\']|\\\\[\\s\\S])*`", 'gs'),
		css: 'string',
	}, {
		regex: regexLib.singleLineCComments,
		css: 'comments',
	}, {
		regex: regexLib.multiLineCComments,
		css: 'comments',
	}, {
		regex: /\s*#.*/gm,
		css: 'preprocessor',
	}, {
		regex: new RegExp(this.getKeywords(keywords), 'gm'),
		css: 'keyword',
	}];

	this.forHtmlScript(regexLib.scriptScriptTags);
}

Brush.prototype = new BrushBase();
export default Brush;
