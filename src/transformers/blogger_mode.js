export default function(code, opts) {
	const br = /<br\s*\/?>|&lt;br\s*\/?&gt;/gi;

	if (opts['bloggerMode'] === true) {
		code = code.replace(br, '\n');
	}

	return code;
}
