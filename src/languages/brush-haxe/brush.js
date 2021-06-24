import BrushBase from '../brush-base/brush-base.js';
import { commonRegExp as regexLib } from '../../utilities/syntaxhighlighter-regex/syntaxhighlighter-regex.js';

function Brush() {
	const inits = 'class interface package macro enum typedef extends implements dynamic in for if while else do try switch case catch';
	const keywords = 'return break continue new throw cast using import function public private inline static untyped callback true false null Int Float String Void Std Bool Dynamic Array Vector';

	this.regexList = [{
		regex: regexLib.singleLineCComments,
		css: 'comments',
	}, {
		regex: regexLib.multiLineCComments,
		css: 'comments',
	}, {
		regex: regexLib.doubleQuotedString,
		css: 'string',
	}, {
		regex: regexLib.singleQuotedString,
		css: 'string',
	}, {
		regex: /\b([\d]+(\.[\d]+)?|0x[a-f0-9]+)\b/gi,
		css: 'value',
	}, {
		regex: new RegExp(this.getKeywords(inits), 'gm'),
		css: 'color3',
	}, {
		regex: new RegExp(this.getKeywords(keywords), 'gm'),
		css: 'keyword',
	}, {
		regex: new RegExp('var', 'gm'),
		css: 'variable',
	}, {
		regex: new RegExp('trace', 'gm'),
		css: 'color1',
	}, {
		regex: new RegExp('#if', 'gm'),
		css: 'comments',
	}, {
		regex: new RegExp('#elseif', 'gm'),
		css: 'comments',
	}, {
		regex: new RegExp('#end', 'gm'),
		css: 'comments',
	}, {
		regex: new RegExp('#error', 'gm'),
		css: 'comments',
	}];

	// standard compiler conditionals flags
	const flags = [
		'debug', 'error', 'cpp', 'js', 'neko', 'php', 'flash', 'flash8', 'flash9', 'flash10', 'flash10', 'mobile', 'desktop', 'web', 'ios', 'android', 'iphone',
	];

	// append the flags to the array with a ! operator
	const length = flags.length;
	for (let index = 0; index <= length - 1; index++) {
		this.regexList.push({
			regex: new RegExp(flags[index], 'gm'),
			css: 'comments',
		});
		this.regexList.push({
			regex: new RegExp(`!${flags[index]}`, 'gm'),
			css: 'comments',
		});
	}

	this.forHtmlScript(regexLib.scriptScriptTags);
}

Brush.prototype = new BrushBase();
export default Brush;
