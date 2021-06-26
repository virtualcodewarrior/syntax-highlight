// https://github.com/virtualcodewarrior/syntaxhighlight
import { webComponentBaseClass } from '../../node_modules/web-component-base-class/src/webComponentBaseClass.js';

const path = document.querySelector('script[src$="/syntax-highlight.js"]')?.src;
if (path) {
	const scriptDir = `${path.split('/').slice(0, -1).join('/')}`; // remove last filename part of path
	const worker = new Worker(`${scriptDir}/syntax-highlight-worker.js`);
	const handlers = {};
	worker.onmessage = (event) => {
		handlers[event.data.id](event.data.formatted);
	};

	const getHighlightedCode = async(language, code, options) => new Promise((resolve) => {
		let id = Date.now();
		while (handlers[id]) {
			id = Date.now();
		}
		handlers[id] = resolve;
		worker.postMessage({ code, language, id, options });
	});

	let handleHighlight;
	const webComponentName = 'syntax-highlight';
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
					observer: (instance) => {
						instance.theme = instance.theme || 'default';
						instance.$.theme.href = `${scriptDir}/../themes/theme-${instance.theme || 'default'}/theme.css`;
					},
				},
				height: {
					type: String,
					value: '',
					reflectToAttribute: true,
					observer: (instance) => {
						instance.$.code.style.height = instance.height || undefined;
					},
				},
				autoLinks: {
					type: Boolean,
					value: true,
					reflectToAttribute: true,
					observer: (instance) => {
						handleHighlight?.(instance);
					},
				},
				firstLine: {
					type: Number,
					value: 1,
					reflectToAttribute: true,
					observer: (instance) => {
						handleHighlight?.(instance);
					},
				},
				gutter: {
					type: Boolean,
					value: true,
					reflectToAttribute: true,
					observer: (instance) => {
						handleHighlight?.(instance);
					},
				},
				highlight: {
					type: Array,
					value: [],
					reflectToAttribute: true,
					observer: (instance) => {
						handleHighlight?.(instance);
					},
				},
				htmlScript: {
					type: Boolean,
					value: false,
					reflectToAttribute: true,
					observer: (instance) => {
						handleHighlight?.(instance);
					},
				},
				smartTabs: {
					type: Boolean,
					value: true,
					reflectToAttribute: true,
					observer: (instance) => {
						handleHighlight?.(instance);
					},
				},
				tabSize: {
					type: Number,
					value: 4,
					reflectToAttribute: true,
					observer: (instance) => {
						handleHighlight?.(instance);
					},
				},
			};
		}

		async attached() {
			this.$.code.style.height = this.height || undefined;
			this.theme = this.theme || 'default';
			this.language = this.language.toLowerCase();
			this.$.theme.href = `${scriptDir}/../themes/theme-${this.theme}/theme.css`;
			this.$.code.innerHTML = `<pre>${this.innerHTML}</pre>`;
			handleHighlight = async(component) => {
				const { autoLinks = true, gutter = true, firstLine = 1, highlight = [], htmlScript = false, smartTabs = true, tabSize = 4 } = component;
				const options = {
					autoLinks,
					gutter,
					htmlScript,
					smartTabs,
					tabSize,
					firstLine,
					highlight,
				};
				if (component.src) {
					let text;
					try {
						const srcResult = await fetch(component.src);
						if (srcResult.ok) {
							text = await srcResult.text();
							component.$.code.innerHTML = await getHighlightedCode(component.language, text, options);
						}
					} catch (err) {
						component.$.code.innerHTML = err;
					}
				} else {
					try {
						component.$.code.innerHTML = await getHighlightedCode(component.language, component.innerHTML, options);
					} catch (err) {
						component.$.code.innerHTML = `<pre>${component.innerHTML}</pre>`;
					}
				}
			};
			handleHighlight(this);
		}

		static get template() {
			return `
		<link id="theme" rel="stylesheet" type="text/css" href="${scriptDir}/../themes/theme-base/theme-base.css">
 		<style>
 		:host {
 			position: relative;
 			display: block;
 		}
 		.wrapper {
			position: relative;
			border: 1px solid #ccc;
			border-radius: 6px;
			padding: 1em;
 		}
 		
		div[slot] {
			overflow-y: auto;
		}
		
		</style>
		<div class="wrapper">
			<div slot="section-content" id="code"></div>
		</div>
		`;
		}
	});
}
