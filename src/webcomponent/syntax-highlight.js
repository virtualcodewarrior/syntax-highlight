// https://github.com/virtualcodewarrior/syntaxhighlight
import { webComponentBaseClass } from '../../node_modules/web-component-base-class/src/webComponentBaseClass.js';

const scriptDir = `${import.meta.url.split('/').slice(0, -1).join('/')}`; // remove last filename part of path
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
		const observer = (instance) => { handleHighlight?.(instance); };
		return {
			language: {
				type: String,
				value: '',
				reflectToAttribute: true,
				observer: (instance) => {
					instance.language = instance.language.toLowerCase();
				},
			},
			src: {
				type: String,
				value: '',
				reflectToAttribute: true,
				observer,
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
			noAutoLinks: {
				type: Boolean,
				value: false,
				reflectToAttribute: true,
				observer,
			},
			firstLine: {
				type: Number,
				value: 1,
				reflectToAttribute: true,
				observer,
			},
			noGutter: {
				type: Boolean,
				value: false,
				reflectToAttribute: true,
				observer,
			},
			highlight: {
				type: Array,
				value: [],
				reflectToAttribute: true,
				observer,
			},
			htmlScript: {
				type: Boolean,
				value: false,
				reflectToAttribute: true,
				observer,
			},
			noSmartTabs: {
				type: Boolean,
				value: false,
				reflectToAttribute: true,
				observer,
			},
			tabSize: {
				type: Number,
				value: 4,
				reflectToAttribute: true,
				observer,
			},
			noCopyButton: {
				type: Boolean,
				value: false,
				reflectToAttribute: true,
			},
		};
	}

	async attached() {
		this.$.code.style.height = this.height || undefined;
		this.theme = this.theme || 'default';
		this.language = this.language.toLowerCase();
		this.$.theme.href = `${scriptDir}/../themes/theme-${this.theme}/theme.css`;
		this.$.code.innerHTML = `<pre>${this.innerHTML}</pre>`;
		this.addAutoEventListener(this.$.copy, 'click', async() => {
			const textBody = this.$.code.querySelector('.syntaxhighlight td.code');
			textBody.classList.add('auto-selecting');
			this.$.mainStyle.innerHTML += '\n::selection { background-color: transparent }';
			const selection = window.getSelection();
			selection.selectAllChildren(textBody);
			await navigator.clipboard.writeText(selection.toString());
			selection.removeAllRanges();
			this.$.mainStyle.innerHTML = this.$.mainStyle.innerHTML.replace('\n::selection { background-color: transparent }', '');
			this.$.copy.textContent = 'copied';
			setTimeout(() => { this.$.copy.textContent = 'copy'; }, 2000);
		});
		let cachedSource = {};
		handleHighlight = async(component) => {
			const { noAutoLinks = false, noGutter = false, firstLine = 1, highlight = [], htmlScript = false, noSmartTabs = false, tabSize = 4 } = component;
			const options = {
				autoLinks: !noAutoLinks,
				gutter: !noGutter,
				htmlScript,
				smartTabs: !noSmartTabs,
				tabSize,
				firstLine,
				highlight,
			};
			if (component.src) {
				let text = cachedSource[component.src];
				try {
					if (!text) {
						const srcResult = await fetch(component.src);
						if (srcResult.ok) {
							cachedSource[component.src] = text = await srcResult.text();
						}
					}
					component.$.code.innerHTML = await getHighlightedCode(component.language, text ?? '', options);
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
	<style id="main-style">
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
	
	:host([no-copy-button]) #copy {
		display: none
	}
	
	#copy {
		position: absolute;
		left: 10px;
		top: 10px;
	}
	
	</style>
	<div class="wrapper">
		<div slot="section-content" id="code"></div>
		<button id="copy">copy</button>
	</div>
	`;
	}
});
