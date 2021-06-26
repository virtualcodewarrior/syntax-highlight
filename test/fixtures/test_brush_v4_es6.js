import BrushBase from '../../src/languages/brush-base/brush-base.js';
import { commonRegExp } from '../../src/utilities/syntaxhighlight-regex/syntaxhighlight-regex.js';

export default class Brush extends BrushBase {
	constructor() {
		super();

		this.regexList = [
			{ regex: /'.*$/gm, css: 'comments' },
			{ regex: /^\s*#.*$/gm, css: 'preprocessor' },
			{ regex: commonRegExp.doubleQuotedString, css: 'string' },
			{ regex: new RegExp(this.getKeywords('hello world'), 'gm'), css: 'keyword' },
		];
	}
}
