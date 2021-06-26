import SyntaxHighlighter, { registerBrush } from '../../src/syntax-highlight.js';
import Brush from '../fixtures/test_brush_v4.js';

describe('integration/commonjs', () => {
	describe('first render pass', () => {
		let div;

		beforeAll(async() => {
			registerBrush(Brush, 'test_brush_v4');

			div = document.createElement('div');
			div.innerHTML = '<pre class="brush: test_brush_v4;">first</pre>';
			document.body.appendChild(div);

			await SyntaxHighlighter.highlight({ gutter: false });

			const wait = async() => {
				await new Promise((resolve) => {
					const doTimeoutFunction = () => {
						if (document.querySelectorAll('.syntaxhighlight').length) {
							resolve();
						} else {
							setTimeout(doTimeoutFunction, 900);
						}
					};
					doTimeoutFunction();
				});
			};

			await wait();
		});

		afterAll(() => {
			document.body.removeChild(div);
		});

		it('has applied the brush', () => expect(document.querySelector('.syntaxhighlight').innerHTML).toContain('<code class="test_brush_v4 plain">first</code>'));
		it('does not render gutter', () => expect(document.querySelectorAll('.syntaxhighlight td.gutter').length).toEqual(0));
	});

	describe('second render pass', () => {
		let div;
		beforeAll(async() => {
			registerBrush(Brush, 'test_brush_v4');

			div = document.createElement('div');
			div.innerHTML = '<pre class="brush: test_brush_v4;">second</pre>';
			document.body.appendChild(div);

			await SyntaxHighlighter.highlight({ gutter: false });

			const wait = async() => {
				await new Promise((resolve) => {
					const doTimeoutFunction = () => {
						if (document.querySelectorAll('.syntaxhighlight').length) {
							resolve();
						} else {
							setTimeout(doTimeoutFunction, 900);
						}
					};
					doTimeoutFunction();
				});
			};

			await wait();
		});

		afterAll(() => {
			document.body.removeChild(div);
		});
		it('has applied the brush second', () => expect(document.querySelectorAll('.syntaxhighlight')[0].innerHTML).toContain('<code class="test_brush_v4 plain">second</code>'));
	});
});
