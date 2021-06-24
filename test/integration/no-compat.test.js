describe('integration/no-compat', () => {
	describe('default settings', () => {
		let div;

		beforeAll(async() => {
			div = document.createElement('div');
			const result = await fetch('/base/test/build-source/index.html');
			div.innerHTML = await result.text();
			document.body.appendChild(div);

			const { default: SyntaxHighlighter, registerBrush } = await import('/base/src/syntaxhighlighter.js');
			registerBrush((await import('/base/test/fixtures/test_brush_v4.js')).default, 'test_brush_v4');
			registerBrush((await import('/base/test/fixtures/html_test_brush_v4.js')).default, 'html_test_brush_v4');
			registerBrush((await import('/base/test/fixtures/test_brush_v4_es6.js')).default, 'test_brush_v4_es6');
			await SyntaxHighlighter.highlight();

			const wait = async() => {
				await new Promise((resolve) => {
					const doTimeoutFunction = () => {
						if (document.querySelector('.syntaxhighlighter')) {
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

		it('highlights v4 brush', () => expect(document.querySelector('.syntaxhighlighter.test_brush_v4')).toBeTruthy());
		it('highlights v4 ES6 brush', () => expect(document.querySelector('.syntaxhighlighter.test_brush_v4_es6')).toBeTruthy());
		it('does not expose window.SyntaxHighlighter', () => expect(window.SyntaxHighlighter).toBeUndefined());
	});

	describe('user settings', () => {
		function test(config) {
			let div;
			beforeAll(async() => {
				div = document.createElement('div');
				const result = await fetch('/base/test/build-source/index.html');
				div.innerHTML = await result.text();
				document.body.appendChild(div);

				const { default: SyntaxHighlighter, registerBrush } = await import('/base/src/syntaxhighlighter.js');
				registerBrush((await import('/base/test/fixtures/test_brush_v4.js')).default, 'test_brush_v4');
				registerBrush((await import('/base/test/fixtures/html_test_brush_v4.js')).default, 'html_test_brush_v4');
				registerBrush((await import('/base/test/fixtures/test_brush_v4_es6.js')).default, 'test_brush_v4_es6');
				await SyntaxHighlighter.highlight(config);

				const wait = async() => {
					await new Promise((resolve) => {
						const doTimeoutFunction = () => {
							if (document.querySelector('.syntaxhighlighter')) {
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
				delete window.syntaxhighlighterConfig;
				document.body.removeChild(div);
			});

			it('highlights v4 brush config', () => expect(document.querySelector('.syntaxhighlighter.test_brush_v4')).toBeTruthy());
			it('highlights v4 ES6 brush config', () => expect(document.querySelector('.syntaxhighlighter.test_brush_v4_es6')).toBeTruthy());
			it('does not expose window.SyntaxHighlighter config', () => expect(window.SyntaxHighlighter).toBeUndefined());
			it('applies custom class name from global config variable to all units', () =>
				expect(document.querySelectorAll('.foo-bar.syntaxhighlighter').length).toEqual(2));
		}

		describe('dash-case arguments', () => test({ 'class-name': 'foo-bar' }));
		describe('camel-case arguments', () => test({ className: 'foo-bar' }));
	});
});
