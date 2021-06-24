import { applyRegexList } from '../syntaxhighlighter-match/syntaxhighlighter-match.js';
import Renderer from './syntaxhighlighter-html-renderer.js';

const REGEX_LIST = [
	{ regex: /hello|world/g, css: 'greeting' },
	{ regex: /\w+/g, css: 'word' },
];

function getHtml(code, opts = {}) {
	const matches = applyRegexList(code, opts.regexList || REGEX_LIST);
	const renderer = new Renderer(code, matches, opts);
	const divElem = document.createElement('div');
	divElem.innerHTML = renderer.getHtml().trim();
	return divElem.firstChild;
}

describe('syntaxhighlighter-html-renderer', () => {
	let element = null;
	let CODE;

	beforeAll(async() => {
		CODE = await (await fetch('/base/src/utilities/syntaxhighlighter-html-renderer/fixture.js')).text();
	});

	function itHasElements({ gutter, lineCount, firstLine = 1, highlight = [] } = {}) {
		describe('gutter', () => {
			if (gutter) {
				it('is present', () => expect(element.querySelectorAll('td.gutter').length).toBe(1));
				it(`has ${lineCount} lines`, () => expect(element.querySelectorAll('td.gutter > .line').length).toBe(lineCount));
				it(`starts at line ${firstLine}`, () => expect(element.querySelector('td.gutter > .line').classList.contains(`number${firstLine}`)).toBe(true));

				highlight.forEach((lineNumber) =>
					it(`has line ${lineNumber} highlighted`, () => {
						expect(element.querySelector(`td.gutter > .line.number${lineNumber}`).classList.contains('highlighted')).toBe(true);
					}),
				);
			} else {
				it('is not present', () => expect(element.querySelectorAll('td.gutter', element).length).toBe(0));
			}
		});

		describe('code', () => {
			it('code - is present', () => expect(element.querySelectorAll('td.code').length).toBe(1));
			it(`code - has ${lineCount} lines`, () => expect(element.querySelectorAll('td.code > .container > .line').length).toBe(lineCount));
			it(`code - starts at line ${firstLine}`, () => expect(element.querySelectorAll('td.code > .container > .line')[0].classList.contains(`number${firstLine}`)).toBe(true));
		});
	}

	describe('rendering with default options', () => {
		beforeAll(() => { element = getHtml(CODE, {}); });
		itHasElements({ gutter: true, lineCount: 14 });
	});

	describe('rendering with options', () => {
		describe('without gutter', () => {
			beforeAll(() => { element = getHtml(CODE, { gutter: false }); });
			itHasElements({ gutter: false, lineCount: 14 });
		});

		describe('custom first line', () => {
			beforeAll(() => { element = getHtml(CODE, { firstLine: 10 }); });
			itHasElements({ gutter: true, lineCount: 14, firstLine: 10 });
		});

		describe('line highlighting', () => {
			describe('one line', () => {
				beforeAll(() => { element = getHtml(CODE, { highlight: 1 }); });
				itHasElements({ gutter: true, lineCount: 14, highlight: [1] });
			});

			describe('multiple lines', () => {
				beforeAll(() => { element = getHtml(CODE, { highlight: ['3', '4'] }); });
				itHasElements({ gutter: true, lineCount: 14, highlight: [3, 4] });
			});
		});

		describe('processing URLs', () => {
			beforeAll(() => { element = getHtml(CODE, { autoLinks: true, regexList: [] }); });
			itHasElements({ gutter: true, lineCount: 14 });
			it('has URL on line 3', () => {
				expect(element.querySelectorAll('td.code > .container > .line.number3 > .plain > a').length).toBe(1);
			});
		});
	});
});
