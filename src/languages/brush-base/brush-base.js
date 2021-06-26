import Renderer from '../../utilities/syntaxhighlight-html-renderer/syntaxhighlight-html-renderer.js';
import { xRegExp } from '../../utilities/syntaxhighlight-regex/syntaxhighlight-regex.js';
import { applyRegexList } from '../../utilities/syntaxhighlight-match/syntaxhighlight-match.js';

export default class BrushBase {
	/**
   * Converts space separated list of keywords into a regular expression string.
   * @param {String} str Space separated keywords.
   * @returns {String} Returns regular expression string.
   */
	// eslint-disable-next-line class-methods-use-this
	getKeywords(str) {
		const results = str.trim().replace(/\s+/g, '|');
		return `\\b(?:${results})\\b`;
	}

	/**
   * Makes a brush compatible with the `html-script` functionality.
   * @param {Object} regexGroup Object containing `left` and `right` regular expressions.
   */
	forHtmlScript(regexGroup) {
		const regex = { end: regexGroup.right.source };

		if (regexGroup.eof) {
			regex.end = `(?:(?:${regex.end})|$)`;
		}

		this.htmlScript = {
			left: { regex: regexGroup.left, css: 'script' },
			right: { regex: regexGroup.right, css: 'script' },
			code: xRegExp(
				`(?<left>${regexGroup.left.source})` +
        '(?<code>.*?)' +
        `(?<right>${regex.end})`,
				'sgi',
			),
		};
	}

	getHtml(code, params = {}) {
		const matches = applyRegexList(code, this.regexList);
		const renderer = new Renderer(code, matches, params);
		return renderer.getHtml();
	}
}
