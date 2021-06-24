import BrushBase from '../../src/languages/brush-base/brush-base.js';
import { commonRegExp as regexLib } from '../../src/utilities/syntaxhighlighter-regex/syntaxhighlighter-regex.js';

function Brush() {
	this.regexList = [
		{ regex: /'.*$/gm, css: 'comments' },
		{ regex: /^\s*#.*$/gm, css: 'preprocessor' },
		{ regex: regexLib.doubleQuotedString, css: 'string' },
		{ regex: new RegExp(this.getKeywords('hello world'), 'gm'), css: 'keyword' },
	];
}

Brush.prototype = new BrushBase();
export default Brush;
