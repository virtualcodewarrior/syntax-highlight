/**
 * Pads number with zeros until it's length is the same as given length.
 *
 * @param {Number} number Number to pad.
 * @param {Number} length Max string length with.
 * @returns {String}     Returns a string padded with proper amount of '0'.
 */
function padNumber(number, length) {
	let result = number.toString();

	while (result.length < length) { result = `0${result}`; }

	return result;
}

function getLines(str) {
	return str.split(/\r?\n/);
}

function getLinesToHighlight(opts) {
	const results = {};
	let linesToHighlight = opts.highlight || [];

	if (typeof (linesToHighlight.push) !== 'function') {
		linesToHighlight = [linesToHighlight];
	}

	for (let index = 0, length = linesToHighlight.length; index < length; index++) {
		results[linesToHighlight[index]] = true;
	}

	return results;
}

export default function Renderer(code, matches, opts) {
	const _this = this;

	_this.opts = opts;
	_this.code = code;
	_this.matches = matches;
	_this.lines = getLines(code);
	_this.linesToHighlight = getLinesToHighlight(opts);
}

Renderer.prototype = {
	/**
	 * Wraps each line of the string into <code/> tag with given style applied to it.
	 *
	 * @param {String} str   Input string.
	 * @param {String} css   Style name to apply to the string.
	 * @returns {String}      Returns input string with each line surrounded by <span/> tag.
	 */
	wrapLinesWithCode(str, css) {
		if (str === null || str.length === 0 || str === '\n' || css === null) {
			return str;
		}

		const _this = this;
		const results = [];
		let line;
		let spaces;

		str = str.replace(/</g, '&lt;');

		// Replace two or more sequential spaces with &nbsp; leaving last space untouched.
		str = str.replace(/ {2,}/g, (string) => {
			spaces = '';

			for (let index = 0, length = string.length; index < length - 1; index++) { spaces += _this.opts.space; }

			return `${spaces} `;
		});

		const lines = getLines(str);

		// Split each line and apply <span class="...">...</span> to them so that leading spaces aren't included.
		for (let index = 0, length = lines.length; index < length; index++) {
			line = lines[index];
			spaces = '';

			if (line.length > 0) {
				// eslint-disable-next-line no-loop-func
				line = line.replace(/^(&nbsp;| )+/, (string) => {
					spaces = string;
					return '';
				});

				line = line.length === 0
					? spaces
					: `${spaces}<code class="${css}">${line}</code>`
				;
			}

			results.push(line);
		}

		return results.join('\n');
	},

	/**
	 * Turns all URLs in the code into <a/> tags.
	 * @param {String} code Input code.
	 * @returns {String} Returns code with </a> tags.
	 */
	processUrls(code) {
		const gt = /(.*)((&gt;|&lt;).*)/;
		const url = /\w+:\/\/[\w-./?%&=:@;#]*/g;

		return code.replace(url, (string) => {
			let suffix = '';
			let match = null;

			// We include &lt; and &gt; in the URL for the common cases like <http://google.com>
			// The problem is that they get transformed into &lt;http://google.com&gt;
			// Where as &gt; easily looks like part of the URL string.
			match = gt.exec(string);
			if (match) {
				string = match[1];
				suffix = match[2];
			}

			return `<a href="${string}">${string}</a>${suffix}`;
		});
	},

	/**
	 * Creates an array containing integer line numbers starting from the 'first-line' param.
	 * @returns {Array} Returns array of integers.
	 */
	figureOutLineNumbers() {
		const lineNumbers = [];
		const lines = this.lines;
		const firstLine = parseInt(this.opts.firstLine || 1, 10);

		for (let index = 0, length = lines.length; index < length; index++) {
			lineNumbers.push(index + firstLine);
		}

		return lineNumbers;
	},

	/**
	 * Generates HTML markup for a single line of code while determining alternating line style.
	 * @param {int} lineIndex  Line index.
	 * @param {int} lineNumber  Line number.
	 * @param {String} lineHtml Line  HTML markup.
	 * @returns {String}       Returns HTML markup.
	 */
	wrapLine(lineIndex, lineNumber, lineHtml) {
		const classes = [
			'line',
			`number${lineNumber}`,
			`index${lineIndex}`,
			`alt${(lineNumber % 2 === 0 ? 1 : 2).toString()}`,
		];

		if (this.linesToHighlight[lineNumber]) {
			classes.push('highlighted');
		}

		if (lineNumber === 0) {
			classes.push('break');
		}

		return `<div class="${classes.join(' ')}">${lineHtml}</div>`;
	},

	/**
	 * Generates HTML markup for line number column.
	 * @param {String} code     Complete code HTML markup.
	 * @param {Array} lineNumbers Calculated line numbers.
	 * @returns {String}       Returns HTML markup.
	 */
	renderLineNumbers(code, lineNumbers) {
		const _this = this;
		const opts = _this.opts;
		let html = '';
		const count = _this.lines.length;
		const firstLine = parseInt(opts.firstLine || 1, 10);
		let pad = opts.padLineNumbers;

		if (pad === true) {
			pad = (firstLine + count - 1).toString().length;
		} else if (isNaN(pad) === true) {
			pad = 0;
		}

		for (let index = 0; index < count; index++) {
			const lineNumber = lineNumbers ? lineNumbers[index] : firstLine + index;
			code = lineNumber === 0 ? opts.space : padNumber(lineNumber, pad);
			html += _this.wrapLine(index, lineNumber, code);
		}

		return html;
	},

	/**
	 * Splits block of text into individual DIV lines.
	 * @param {String} htmlIn     Code to highlight.
	 * @param {Array} lineNumbers Calculated line numbers.
	 * @returns {String}       Returns highlighted code in HTML form.
	 */
	getCodeLinesHtml(htmlIn, lineNumbers) {
		const _this = this;
		const opts = _this.opts;
		const lines = getLines(htmlIn);
		const firstLine = parseInt(opts.firstLine || 1, 10);
		const brushName = opts.brush;
		let html = '';

		for (let index = 0, length = lines.length; index < length; index++) {
			let line = lines[index];
			const indent = /^(&nbsp;|\s)+/.exec(line);
			let spaces = null;
			const lineNumber = lineNumbers ? lineNumbers[index] : firstLine + index;

			if (indent !== null) {
				spaces = indent[0].toString();
				line = line.substr(spaces.length);
				spaces = spaces.replace(' ', opts.space);
			}

			if (line.length === 0) {
				line = opts.space;
			}

			html += _this.wrapLine(
				index,
				lineNumber,
				(spaces !== null ? `<code class="${brushName} spaces">${spaces}</code>` : '') + line,
			);
		}

		return html;
	},

	/**
	 * @param {string} title Table title
	 * @returns {string} HTML for the table title or empty string if title is null.
	 */
	getTitleHtml(title) {
		return title ? `<caption>${title}</caption>` : '';
	},

	/**
	 * Finds all matches in the source code.
	 * @param {String} code   Source code to process matches in.
	 * @param {Array} matches Discovered regex matches.
	 * @returns {String} Returns formatted HTML with processed matches.
	 */
	getMatchesHtml(code, matches) {
		const _this = this;
		let pos = 0;
		let result = '';
		const brushName = _this.opts.brush || '';
		let matchBrushName;

		function getBrushNameCss(match) {
			const cssResult = match ? (match.brushName || brushName) : brushName;
			return cssResult ? `${cssResult} ` : '';
		}

		// Finally, go through the final list of matches and pull the all
		// together adding everything in between that isn't a match.
		for (let index = 0, length = matches.length; index < length; index++) {
			const match = matches[index];

			if (match !== null && match.length !== 0) {
				matchBrushName = getBrushNameCss(match);

				result += _this.wrapLinesWithCode(code.substr(pos, match.index - pos), `${matchBrushName}plain`)
					+ _this.wrapLinesWithCode(match.value, matchBrushName + match.css);

				pos = match.index + match.length + (match.offset || 0);
			}
		}

		// don't forget to add whatever's remaining in the string
		result += _this.wrapLinesWithCode(code.substr(pos), `${getBrushNameCss()}plain`);

		return result;
	},

	/**
	 * Generates HTML markup for the whole syntax highlighter.
	 * @returns {String} Returns HTML markup.
	 */
	getHtml() {
		const _this = this;
		const opts = _this.opts;
		const code = _this.code;
		const matches = _this.matches;
		const classes = ['syntaxhighlighter'];
		let lineNumbers;
		let html;

		if (opts.collapse === true) {
			classes.push('collapsed');
		}

		const gutter = opts.gutter !== false;

		if (!gutter) {
			classes.push('nogutter');
		}

		// add custom user style name
		classes.push(opts.className);

		// add brush alias to the class name for custom CSS
		classes.push(opts.brush);

		if (gutter) {
			lineNumbers = _this.figureOutLineNumbers(code);
		}

		// processes found matches into the html
		html = _this.getMatchesHtml(code, matches);

		// finally, split all lines so that they wrap well
		html = _this.getCodeLinesHtml(html, lineNumbers);

		// finally, process the links
		if (opts.autoLinks) {
			html = _this.processUrls(html);
		}

		html = `
      <div class="${classes.join(' ')}">
        <table border="0" cellpadding="0" cellspacing="0">
          ${_this.getTitleHtml(opts.title)}
          <tbody>
            <tr>
              ${gutter ? `<td class="gutter">${_this.renderLineNumbers(code)}</td>` : ''}
              <td class="code">
                <div class="container">${html}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

		return html;
	},
};
