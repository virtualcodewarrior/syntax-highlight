import BrushBase from '../brush-base/brush-base.js';
import { commonRegExp as regexLib } from '../../utilities/syntaxhighlighter-regex/syntaxhighlighter-regex.js';

function Brush() {
	const keywords = 'break case catch class continue ' +
		'default delete do else enum export extends false  ' +
		'for from as function if implements import in instanceof ' +
		'interface let new null package private protected ' +
		'static return super switch ' +
		'this throw true try typeof var while with yield';

	this.regexList = [{
		regex: regexLib.multiLineDoubleQuotedString,
		css: 'string',
	}, {
		regex: regexLib.multiLineSingleQuotedString,
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
