import BrushBase from '../brush-base/brush-base.js';
import { commonRegExp as regexLib, xRegExp } from '../../utilities/syntaxhighlighter-regex/syntaxhighlighter-regex.js';
import { Match } from '../../utilities/syntaxhighlighter-match/lib/match.js';

function Brush() {
	function process(match) {
		const code = match[0];
		const tag = xRegExp.exec(code, xRegExp('(&lt;|<)[\\s\\/\\?!]*(?<name>[:\\w-\\.]+)', 'xg'));
		const result = [];

		if (match.attributes !== null) {
			let attributes;
			let pos = 0;
			const regex = xRegExp('(?<name> [\\w:.-]+)' +
				'\\s*=\\s*' +
				'(?<value> ".*?"|\'.*?\'|\\w+)',
			'xg');

			while ((attributes = xRegExp.exec(code, regex, pos)) !== null) {
				result.push(new Match(attributes.name, match.index + attributes.index, 'color1'));
				result.push(new Match(attributes.value, match.index + attributes.index + attributes[0].indexOf(attributes.value), 'string'));
				pos = attributes.index + attributes[0].length;
			}
		}

		if (tag !== null) {
			result.push(
				new Match(tag.name, match.index + tag[0].indexOf(tag.name), 'keyword'),
			);
		}

		return result;
	}

	this.regexList = [{
		regex: xRegExp('(\\&lt;|<)\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\](\\&gt;|>)', 'gm'),
		css: 'color2',
	}, {
		regex: regexLib.xmlComments,
		css: 'comments',
	}, {
		regex: xRegExp('(&lt;|<)[\\s\\/\\?!]*(\\w+)(?<attributes>.*?)[\\s\\/\\?]*(&gt;|>)', 'sg'),
		func: process,
	}];
}

Brush.prototype = new BrushBase();
export default Brush;
