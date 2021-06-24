import retabber from './retabber.js';

const CODE_4 =
	`the\t\twords\tin\t\tthis\tparagraph
should\tlook\tlike\tthey\tare
evenly\tspaced\tbetween\tcolumns`;

const CODE_8 =
	`the\twords\t\tin\t\tthis\t\tparagraph
should\tlook\t\tlike\t\tthey\t\tare
evenly\tspaced\t\tbetween\t\tcolumns`;

describe('retabber', () => {
	describe('.smart', () => {
		it('uses 4 spaces', () => {
			const actual = retabber.smart(CODE_4, 4);
			expect(actual).toEqual(
				`the     words   in      this    paragraph
should  look    like    they    are
evenly  spaced  between columns`,
			);
		});

		it('uses 8 spaces', () => {
			const actual = retabber.smart(CODE_8, 8);
			expect(actual).toEqual(
				`the     words           in              this            paragraph
should  look            like            they            are
evenly  spaced          between         columns`,
			);
		});
	});

	describe('.regular', () => {
		it('uses 4 spaces regular', () => {
			const actual = retabber.regular(CODE_4, 4);
			expect(actual).toEqual(
				`the        words    in        this    paragraph
should    look    like    they    are
evenly    spaced    between    columns`,
			);
		});

		it('uses 8 spaces regular', () => {
			const actual = retabber.regular(CODE_8, 8);
			expect(actual).toEqual(
				`the        words                in                this                paragraph
should        look                like                they                are
evenly        spaced                between                columns`,
			);
		});
	});
});

