import BrushBase from './brush-base.js';

class TestBrush extends BrushBase {
	constructor() {
		super();

		this.regexList = [
			{ regex: new RegExp(this.getKeywords('foo bar', { css: 'test' })) },
		];
	}
}

describe('brush-base', () => {
	describe('new brush', () => {
		let brush;

		beforeEach(() => {
			brush = new TestBrush();
		});

		it('has `regexList`', () => {
			expect(brush.regexList).not.toBeUndefined();
		});

		it('sets keywords', () => {
			expect(brush.regexList[0].regex.toString()).toEqual('/\\b(?:foo|bar)\\b/');
		});

		it('.getHtml()', () => {
			const html = brush.getHtml('bar foo', { className: 'test_brush' });
			expect(html).toBeTruthy();
			expect(html).toMatch(/class=".*test_brush.*"/);
		});
	});
});
