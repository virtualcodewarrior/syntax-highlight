// eslint-disable-next-line no-undef
let HighlighterModule;
onmessage = async(event) => {
	HighlighterModule = HighlighterModule ?? await import('../syntaxhighlighter.js');
	// eslint-disable-next-line no-undef
	const result = await HighlighterModule.default.highlightLanguage(event.data.code, event.data.language);
	postMessage({ formatted: result, id: event.data.id });
};
