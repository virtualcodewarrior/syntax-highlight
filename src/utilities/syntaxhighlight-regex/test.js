import { commonRegExp, xRegExp } from './syntaxhighlight-regex.js';

describe('syntaxhighlight-regex', () => {
	describe('commonRegExp', () => {
		it('is ok', () => expect(commonRegExp).toBeTruthy());
		it('has multiLineCComments', () => expect(commonRegExp.multiLineCComments).not.toBeUndefined());
	});

	describe('XRegExp', () => {
		it('xRegExp - is ok', () => expect(xRegExp).toBeTruthy());
	});
});
