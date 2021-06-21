import SyntaxHighlighter, { registerBrush } from './core.js';
import javascript from '../languages/brush-javascript/brush.js';
import * as dasherize from './dasherize.js';

function ready(fn) {
	if (document.readyState !== 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

registerBrush(javascript);

ready(() => SyntaxHighlighter.highlight(dasherize.object(window.syntaxhighlighterConfig || {})));

export * from './core.js';
