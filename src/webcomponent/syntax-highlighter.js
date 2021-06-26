import { webComponentBaseClass } from '../../node_modules/web-component-base-class/src/webComponentBaseClass.js';

const path = document.querySelector('script[src$="/syntax-highlighter.js"]')?.src;
if (path) {
	const scriptDir = `${path.split('/').slice(0, -1).join('/')}`; // remove last filename part of path
	const worker = new Worker(`${scriptDir}/syntax-highlighter-worker.js`);
	const handlers = {};
	worker.onmessage = (event) => {
		handlers[event.data.id](event.data.formatted);
	};

	const getHighlightedCode = async(language, code) => new Promise((resolve) => {
		let id = Date.now();
		while (handlers[id]) {
			id = Date.now();
		}
		handlers[id] = resolve;
		worker.postMessage({ code, language, id });
	});

	const webComponentName = 'syntax-highlighter';
	window.customElements.define(webComponentName, class extends webComponentBaseClass {
		static get is() { return webComponentName; }

		constructor() {
			super();
		}

		static get properties() {
			return {
				language: {
					type: String,
					value: '',
					reflectToAttribute: true,
				},
				src: {
					type: String,
					value: '',
					reflectToAttribute: true,
				},
				theme: {
					type: String,
					value: 'default',
					reflectToAttribute: true,
				},
			};
		}

		async attached() {
			this.theme = this.theme || 'default';
			this.language = this.language.toLowerCase();
			this.$.theme.href = `${scriptDir}/../themes/theme-${this.theme}/theme.css`;
			this.$.code.innerHTML = `<pre>${this.innerHTML}</pre>`;
			const handleHighlight = async() => {
				if (this.src) {
					let text;
					try {
						const srcResult = await fetch(this.src);
						if (srcResult.ok) {
							text = await srcResult.text();
							this.$.code.innerHTML = await getHighlightedCode(this.language, text);
						}
					} catch (err) {
						this.$.code.innerHTML = err;
					}
				} else {
					try {
						this.$.code.innerHTML = await getHighlightedCode(this.language, this.innerHTML, this.options);
					} catch (err) {
						this.$.code.innerHTML = `<pre>${this.innerHTML}</pre>`;
					}
				}
			};

			handleHighlight();
		}

		static get template() {
			return `
		<link id="theme" rel="stylesheet" type="text/css" href="${scriptDir}/../themes/theme-base/theme-base.css">
 		<style>
		div[slot] {
			border: 1px solid #ccc;
			border-radius: 6px;
			padding: 1em;
		}
		</style>
		<div slot="section-content" id="code"></div>
		`;
		}
	});
}
