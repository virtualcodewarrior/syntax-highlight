import trim from './trim.js';
import bloggerMode from './blogger_mode.js';
import stripBrs from './strip_brs.js';
import unindenter from '../utilities/unindenter/unindenter.js';
import retabber from '../utilities/retabber/retabber.js';

export default function(code, opts) {
	code = trim(code, opts);
	code = bloggerMode(code, opts);
	code = stripBrs(code, opts);
	code = unindenter.unindent(code, opts);

	const tabSize = opts['tab-size'];
	code = opts['smart-tabs'] === true ? retabber.smart(code, tabSize) : retabber.regular(code, tabSize);

	return code;
}
