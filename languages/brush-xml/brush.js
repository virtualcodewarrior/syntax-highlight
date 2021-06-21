import BrushBase from '../brush-base/brush-base.js';
import { commonRegExp as regexLib } from '../../utilities/syntaxhighlighter-regex/index.js';
import { XRegExp } from '../../utilities/syntaxhighlighter-regex/index.js';
import { Match } from '../../utilities/syntaxhighlighter-match/index.js';

function Brush() {
	function process(match, regexInfo) {
		var code = match[0],
			tag = XRegExp.exec(code, XRegExp('(&lt;|<)[\\s\\/\\?!]*(?<name>[:\\w-\\.]+)', 'xg')),
			result = [];

		if (match.attributes != null) {
			var attributes,
				pos = 0,
				regex = XRegExp('(?<name> [\\w:.-]+)' +
					'\\s*=\\s*' +
					'(?<value> ".*?"|\'.*?\'|\\w+)',
					'xg');

			while ((attributes = XRegExp.exec(code, regex, pos)) != null) {
				result.push(new Match(attributes.name, match.index + attributes.index, 'color1'));
				result.push(new Match(attributes.value, match.index + attributes.index + attributes[0].indexOf(attributes.value), 'string'));
				pos = attributes.index + attributes[0].length;
			}
		}

		if (tag != null) {
			result.push(
				new Match(tag.name, match.index + tag[0].indexOf(tag.name), 'keyword')
			);
		}

		return result;
	}

	this.regexList = [
		{
			regex: XRegExp('(\\&lt;|<)\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\](\\&gt;|>)', 'gm'),
			css: 'color2'
		},
		{
			regex: regexLib.xmlComments,
			css: 'comments'
		},
		{
			regex: XRegExp('(&lt;|<)[\\s\\/\\?!]*(\\w+)(?<attributes>.*?)[\\s\\/\\?]*(&gt;|>)', 'sg'),
			func: process
		}
	];
}

Brush.prototype = new BrushBase();
Brush.aliases = ['xml', 'xhtml', 'xslt', 'html', 'plist'];
export default Brush;
