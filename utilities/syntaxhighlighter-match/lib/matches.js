import { Match } from './match.js';
import { xRegExp } from '../../syntaxhighlighter-regex/syntaxhighlighter-regex.js';

/**
 * Executes given regular expression on provided code and returns all matches that are found.
 *
 * @param {String} code    Code to execute regular expression on.
 * @param {Object} regex   Regular expression item info from `regexList` collection.
 * @returns {Array}         Returns a list of Match objects.
 */
export function find(code, regexInfo) {
	function defaultAdd(match, regexInfo) {
		return match[0];
	}

	let index = 0,
	match = null,
	matches = [],
	process = regexInfo.func ? regexInfo.func : defaultAdd,
	pos = 0
	;

	while (match = xRegExp.exec(code, regexInfo.regex, pos)) {
		let resultMatch = process(match, regexInfo);

		if (typeof resultMatch === 'string') {
			resultMatch = [new Match(resultMatch, match.index, regexInfo.css)];
		}

		matches = matches.concat(resultMatch);
		pos = match.index + match[0].length;
	}

	return matches;
}

/**
 * Sorts matches by index position and then by length.
 */
export function sort(matches) {
	function sortMatchesCallback(m1, m2) {
		// sort matches by index first
		if (m1.index < m2.index) {
			return -1;
		} else if (m1.index > m2.index) {
			return 1;
		}
		// if index is the same, sort by length
		if (m1.length < m2.length) {
			return -1;
		} else if (m1.length > m2.length) {
			return 1;
		}
		

		return 0;
	}

	return matches.sort(sortMatchesCallback);
}

export function compact(matches) {
	let result = [],
	i, l;

	for (i = 0, l = matches.length; i < l; i++) {
		if (matches[i]) {
			result.push(matches[i]);
		}
	}

	return result;
}

/**
 * Checks to see if any of the matches are inside of other matches.
 * This process would get rid of highligted strings inside comments,
 * keywords inside strings and so on.
 */
export function removeNested(matches) {
	// Optimized by Jose Prado (http://joseprado.com)
	for (let i = 0, l = matches.length; i < l; i++) {
		if (matches[i] === null) {
			continue;
		}

		const itemI = matches[i],
		itemIEndPos = itemI.index + itemI.length
		;

		for (let j = i + 1, l = matches.length; j < l && matches[i] !== null; j++) {
			const itemJ = matches[j];

			if (itemJ === null) {
				continue;
			} else if (itemJ.index > itemIEndPos) {
				break;
			} else if (itemJ.index === itemI.index && itemJ.length > itemI.length) {
				matches[i] = null;
			} else if (itemJ.index >= itemI.index && itemJ.index < itemIEndPos) {
				matches[j] = null;
			}
		}
	}

	return matches;
}
