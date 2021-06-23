import BrushBase from '../brush-base/brush-base.js';
import { commonRegExp as regexLib } from '../../utilities/syntaxhighlighter-regex/syntaxhighlighter-regex.js';

function Brush() {
	// Contributed by Erik Peterson.
	const keywords = 'alias and BEGIN begin break case class def define_method defined do each else elsif ' +
		'END end ensure false for if in module new next nil not or raise redo rescue retry return ' +
		'self super then throw true undef unless until when while yield';

	const builtins = 'Array Bignum Binding Class Continuation Dir Exception FalseClass File::Stat File Fixnum Fload ' +
		'Hash Integer IO MatchData Method Module NilClass Numeric Object Proc Range Regexp String Struct::TMS Symbol ' +
		'ThreadGroup Thread Time TrueClass';

	this.regexList = [{
		regex: regexLib.singleLinePerlComments,
		css: 'comments',
	}, {
		regex: regexLib.doubleQuotedString,
		css: 'string',
	}, {
		regex: regexLib.singleQuotedString,
		css: 'string',
	}, {
		regex: /\b[A-Z0-9_]+\b/g,
		css: 'constants',
	}, {
		regex: /:[a-z][A-Za-z0-9_]*/g,
		css: 'color2',
	}, {
		regex: /(\$|@@|@)\w+/g,
		css: 'variable bold',
	}, {
		regex: new RegExp(this.getKeywords(keywords), 'gm'),
		css: 'keyword',
	}, {
		regex: new RegExp(this.getKeywords(builtins), 'gm'),
		css: 'color1',
	}];

	this.forHtmlScript(regexLib.aspScriptTags);
}

Brush.prototype = new BrushBase();
export default Brush;
