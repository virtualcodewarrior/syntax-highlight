export default function(code, opts) {
	const br = /<br\s*\/?>|&lt;br\s*\/?&gt;/gi;

	if (opts['stripBrs'] === true) {
		code = code.replace(br, '');
	}

	return code;
}
