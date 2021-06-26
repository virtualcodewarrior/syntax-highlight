import { xRegExp } from '../syntaxhighlight-regex/syntaxhighlight-regex.js';

const BOOLEANS = { true: true, false: false };

function camelize(key) {
	return key.replace(/-(\w+)/g, (match, word) => word.charAt(0).toUpperCase() + word.substr(1));
}

function process(value) {
	const result = BOOLEANS[value];
	return result === undefined ? value : result;
}

export default{
	defaults(target, source) {
		for (const key in source || {}) {
			if (!target.hasOwnProperty(key)) {
				target[key] = target[camelize(key)] = source[key];
			}
		}

		return target;
	},
	parse(str) {
		let match;
		const result = {};
		const arrayRegex = xRegExp('^\\[(?<values>(.*?))\\]$');
		let pos = 0;
		const regex = xRegExp(
			'(?<name>[\\w-]+)' +
			'\\s*:\\s*' +
			'(?<value>' +
			'[\\w%#-]+|' + // word
			'\\[.*?\\]|' + // [] array
			'".*?"|' + // "" string
			'\'.*?\'' + // '' string
			')\\s*;?',
			'g',
		);

		while ((match = xRegExp.exec(str, regex, pos)) !== null) {
			let value = match.value.replace(/^['"]|['"]$/g, ''); // strip quotes from end of strings

			// try to parse array value
			if (value !== null && arrayRegex.test(value)) {
				const matches = xRegExp.exec(value, arrayRegex);
				value = matches.values.length > 0 ? matches.values.split(/\s*,\s*/) : [];
			}

			value = process(value);
			result[match.name] = result[camelize(match.name)] = value;
			pos = match.index + match[0].length;
		}

		return result;
	},
};
