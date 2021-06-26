import { applyRegexList } from '../syntaxhighlight-match.js';

const REGEX_LIST = [
	{ regex: /hello|world/g, css: 'greeting' },
	{ regex: /\w+/g, css: 'word' },
];

describe('apply-regex-list', () => {
	let matches = null;

	describe('applyRegexList', () => {
		beforeAll(() => {
			matches = applyRegexList('hello all world', REGEX_LIST);
		});

		describe('matches', () => {
			it('is an array', () => expect(matches).toBeInstanceOf(Array));
			it('has items', () => expect(matches.length).toBeGreaterThan(0));
		});

		describe('first match', () => {
			it('is `hello`', () => expect(matches[0].value).toEqual('hello'));
			it('is a greeting', () => expect(matches[0].css).toEqual('greeting'));
		});

		describe('second match', () => {
			it('is `all`', () => expect(matches[1].value).toEqual('all'));
			it('is a word', () => expect(matches[1].css).toEqual('word'));
		});

		describe('third match', () => {
			it('third match - is `world`', () => expect(matches[2].value).toEqual('world'));
			it('third match - is a greeting', () => expect(matches[2].css).toEqual('greeting'));
		});
	});
});
