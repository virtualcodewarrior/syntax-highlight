import BrushBase from '../brush-base/brush-base.js';
import { commonRegExp as regexLib } from '../../utilities/syntaxhighlight-regex/syntaxhighlight-regex.js';

function Brush() {
	// Created by Peter Atoria @ http://iAtoria.com
	const inits = 'class interface function package';
	const keywords = '-Infinity ...rest Array as AS3 Boolean break case catch const continue Date decodeURI ' +
		'decodeURIComponent default delete do dynamic each else encodeURI encodeURIComponent escape ' +
		'extends false final finally flash_proxy for get if implements import in include Infinity ' +
		'instanceof int internal is isFinite isNaN isXMLName label namespace NaN native new null ' +
		'Null Number Object object_proxy override parseFloat parseInt private protected public ' +
		'return set static String super switch this throw true try typeof uint undefined unescape ' +
		'use void while with';

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
	}];

	this.forHtmlScript(regexLib.scriptScriptTags);
}

Brush.prototype = new BrushBase();
export default Brush;
