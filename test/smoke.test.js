import SyntaxHighlighter, { registerBrush } from '../src/syntaxhighlight.js';
import TestBrushV4 from './fixtures/test_brush_v4.js';
import HTMLTestBrushV4 from './fixtures/html_test_brush_v4.js';

function expectSelectorToBePresent(element, selector, content, count = 1) {
	const el = Array.from(element.querySelectorAll(selector)).filter((elm) => !content || elm.textContent === content);
	expect(el.length).toEqual(count);
}

function html2element(html) {
	const div = document.createElement('div');
	div.innerHTML = html;
	return div;
}

function remove(el) {
	if (el.parentNode) {
		el.parentNode.removeChild(el);
	}
}

describe('integration', () => {
	let highlighter;
	let pre;

	async function createHighlighter(html) {
		pre = html2element(html);
		document.body.appendChild(pre);
		registerBrush(TestBrushV4, 'test_brush_v4');
		registerBrush(HTMLTestBrushV4, 'html_test_brush_v4');
		await SyntaxHighlighter.highlight();
		highlighter = document.querySelector('.syntaxhighlight');
	}

	function itHasCommonElements() {
		describe('highlighted element', () => {
			it('exists', () => {
				expect(highlighter).toBeTruthy();
			});

			it('has gutter', () => {
				expectSelectorToBePresent(highlighter, 'td.gutter');
			});

			it('has code', () => {
				expectSelectorToBePresent(highlighter, 'td.code');
			});
		});
	}

	afterEach(() => {
		if (pre) {
			remove(pre);
		}
		if (highlighter) {
			remove(highlighter);
		}

		pre = highlighter = null;
	});

	function testElementDetection(brushName) {
		describe('element detection', () => {
			describe(`using '<pre class="brush: ${brushName}">'`, () => {
				beforeEach(async() => await createHighlighter(`<pre class="brush: ${brushName}">hello world</pre>`));
				itHasCommonElements();
			});

			describe(`using '<script type="syntaxhighlight" class="brush: ${brushName}">'`, () => {
				beforeEach(async() => await createHighlighter(`<script type="syntaxhighlight" class="brush: ${brushName}">hello world</script>`));
				itHasCommonElements();
			});

			describe(`using '<script type="text/syntaxhighlight" class="brush: ${brushName}">'`, () => {
				beforeEach(async() => await createHighlighter(`<script type="text/syntaxhighlight" class="brush: ${brushName}">hello world</script>`));
				itHasCommonElements();
			});
		});
	}

	function testRegularBrush(brushName) {
		describe(`regular brush '<pre class="brush: ${brushName}">'`, () => {
			beforeEach(async() => {
				await createHighlighter(`
          <pre class="brush: ${brushName}">
            hello world
            how are things?
          </pre>
        `);
			});

			itHasCommonElements();

			describe('class names', () => {
				it('applies brush name', () => {
					expectSelectorToBePresent(highlighter, `td.code .line.number1 > code.${brushName}.keyword`, 'hello');
				});
			});
		});
	}

	function testHtmlScriptBrush(brushName) {
		describe(`html-script brush '<pre class="brush: ${brushName}; html-script: true">'`, () => {
			beforeEach(async() => {
				await createHighlighter(`
          <pre class="brush: ${brushName}; html-script: true">
            world &lt;script>&lt;?= hello world ?>&lt;/script>
            how are you?
          </pre>
        `);
			});

			itHasCommonElements();

			describe('class names', () => {
				it('applies htmlscript class name', () => {
					expectSelectorToBePresent(highlighter, 'td.code .line.number1 > code.htmlscript.keyword', 'script', 2);
				});

				it('applies brush class name', () => {
					expectSelectorToBePresent(highlighter, `td.code .line.number1 > code.${brushName}.keyword`, 'hello');
				});
			});
		});
	}

	describe('v4 brushes', () => {
		testElementDetection('test_brush_v4');
		testRegularBrush('test_brush_v4');
		testHtmlScriptBrush('html_test_brush_v4');
	});
});
