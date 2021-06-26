import BrushBase from '../brush-base/brush-base.js';
import { commonRegExp as regexLib } from '../../utilities/syntaxhighlight-regex/syntaxhighlight-regex.js';

function Brush() {
	// Contributed by Jean-Lou Dupont
	// http://jldupont.blogspot.com/2009/06/erlang-syntax-highlighter.html

	// According to: http://erlang.org/doc/reference_manual/introduction.html#1.5
	const keywords = 'after and andalso band begin bnot bor bsl bsr bxor ' +
		'case catch cond div end fun if let not of or orelse ' +
		'query receive rem try when xor' +
		// additional
		' module export import define';

	this.regexList = [{
		regex: new RegExp('[A-Z][A-Za-z0-9_]+', 'g'),
		css: 'constants',
	}, {
		regex: new RegExp('\\%.+', 'gm'),
		css: 'comments',
	}, {
		regex: new RegExp('\\?[A-Za-z0-9_]+', 'g'),
		css: 'preprocessor',
	}, {
		regex: new RegExp('[a-z0-9_]+:[a-z0-9_]+', 'g'),
		css: 'functions',
	}, {
		regex: regexLib.doubleQuotedString,
		css: 'string',
	}, {
		regex: regexLib.singleQuotedString,
		css: 'string',
	}, {
		regex: new RegExp(this.getKeywords(keywords), 'gm'),
		css: 'keyword',
	}];
}

Brush.prototype = new BrushBase();
Brush.aliases = ['erl', 'erlang'];
export default Brush;
