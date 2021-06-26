describe('integration/compat', () => {
	function setupSyntaxHighlighter() {
		let div;

		beforeAll(async() => {
			div = document.createElement('div');
			const result = await fetch('/base/test/build-source/index.html');
			div.innerHTML = await result.text();
			document.body.appendChild(div);

			const { default: SyntaxHighlighter, registerBrush } = await import('/base/src/syntax-highlight.js');
			registerBrush((await import('/base/test/fixtures/test_brush_v4.js')).default, 'test_brush_v4');
			registerBrush((await import('/base/test/fixtures/html_test_brush_v4.js')).default, 'html_test_brush_v4');
			registerBrush((await import('/base/test/fixtures/test_brush_v4_es6.js')).default, 'test_brush_v4_es6');
			await SyntaxHighlighter.highlight();

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
	}

	describe('when xRegExp is already present', () => {
		beforeAll(() => {
			window.XRegExp = '...';
		});

		setupSyntaxHighlighter();

		it('does not overwrite existing instance of xRegExp', () => expect(window.XRegExp).toEqual('...'));
	});
});
