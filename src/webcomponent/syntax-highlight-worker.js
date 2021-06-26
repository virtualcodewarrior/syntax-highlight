// eslint-disable-next-line no-undef
let HighlighterModule;
onmessage = async(event) => {
	HighlighterModule = HighlighterModule ?? await import('../syntax-highlight.js');
	// eslint-disable-next-line no-undef
	const result = await HighlighterModule.default.highlightLanguage(event.data.code, event.data.language, event.data.options);
	postMessage({ formatted: result, id: event.data.id });
};
