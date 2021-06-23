function isEmpty(str) {
	return /^\s*$/.test(str);
}

export default{
	unindent(code) {
		const lines = code.split(/\r?\n/);
		const regex = /^\s*/;
		let min = 1000;
		let line;
		let matches;

		// go through every line and check for common number of indents
		for (let index = 0, length = lines.length; index < length && min > 0; index++) {
			line = lines[index];

			if (!isEmpty(line)) {
				matches = regex.exec(line);

				// In the event that just one line doesn't have leading white space
				// we can't unindent anything, so bail completely.
				if (matches === null) {
					return code;
				}

				min = Math.min(matches[0].length, min);
			}
		}

		// trim minimum common number of white space from the begining of every line
		if (min > 0) {
			for (let index = 0, length = lines.length; index < length; index++) {
				if (!isEmpty(lines[index])) {
					lines[index] = lines[index].substr(min);
				}
			}
		}

		return lines.join('\n');
	},
};
