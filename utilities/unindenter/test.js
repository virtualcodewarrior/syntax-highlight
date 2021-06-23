import unindenter from './unindenter.js';

describe('unindenter', () => {
	describe('.unindent', () => {
		it('removes common number of tabs from each line', () => {
			const actual = unindenter.unindent('\t\t1\n\t\t2');
			expect(actual).toEqual('1\n2');
		});

		it('ignores empty lines', () => {
			const actual = unindenter.unindent('\t\t1\n\n  \n\t\t2\n\t\t\t3');
			expect(actual).toEqual('1\n\n  \n2\n\t3');
		});
	});
});
