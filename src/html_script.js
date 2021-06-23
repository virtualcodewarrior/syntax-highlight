import { applyRegexList } from '../utilities/syntaxhighlighter-match/syntaxhighlighter-match.js';

function HtmlScript(BrushXML, brushClass) {
	let scriptBrush;
	const xmlBrush = new BrushXML();

	if (brushClass == null) {
		return;
	}

	scriptBrush = new brushClass();

	if (scriptBrush.htmlScript == null) {
		throw new Error('Brush wasn\'t configured for html-script option: ' + brushClass.brushName);
	}

	xmlBrush.regexList.push(
		{ regex: scriptBrush.htmlScript.code, func: process }
	);

	this.regexList = xmlBrush.regexList;

	function offsetMatches(matches, offset) {
		for (let j = 0, l = matches.length; j < l; j++) {
			matches[j].index += offset;
		}
	}

	function process(match, info) {
		const code = match.code;
		let results = [];
		const regexList = scriptBrush.regexList;
		const offset = match.index + match.left.length;
		const htmlScript = scriptBrush.htmlScript;
		let matches;

		function add(matches) {
			results = results.concat(matches);
		}

		matches = applyRegexList(code, regexList);
		offsetMatches(matches, offset);
		add(matches);

		// add left script bracket
		if (htmlScript.left !== null && match.left !== null) {
			matches = applyRegexList(match.left, [htmlScript.left]);
			offsetMatches(matches, match.index);
			add(matches);
		}

		// add right script bracket
		if (htmlScript.right !== null && match.right !== null) {
			matches = applyRegexList(match.right, [htmlScript.right]);
			offsetMatches(matches, match.index + match[0].lastIndexOf(match.right));
			add(matches);
		}

		for (let j = 0, l = results.length; j < l; j++)
			results[j].brushName = brushClass.brushName;

		return results;
	}
}

export default HtmlScript;
