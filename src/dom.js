/**
 * Finds all &lt;SCRIPT TYPE="text/syntaxhighlight" /> elementss.
 * Finds both "text/syntaxhighlight" and "syntaxhighlight"
 * ...in order to make W3C validator happy with subtype and backwardscompatible without subtype
 * @return {Array} Returns array of all found SyntaxHighlighter tags.
 */
function getSyntaxHighlighterScriptTags() {
	const tags = document.getElementsByTagName('script');
	const result = [];

	for (let i = 0; i < tags.length; i++)
		if (tags[i].type === 'text/syntaxhighlight' || tags[i].type === 'syntaxhighlight') {
			result.push(tags[i]);
		}

	return result;
}

/**
 * Checks if target DOM elements has specified CSS class.
 * @param {DOMElement} target Target DOM element to check.
 * @param {String} className Name of the CSS class to check for.
 * @return {Boolean} Returns true if class name is present, false otherwise.
 */
function hasClass(target, className) {
	return target.className.indexOf(className) !== -1;
}

/**
 * Adds CSS class name to the target DOM element.
 * @param {DOMElement} target Target DOM element.
 * @param {String} className New CSS class to add.
 */
function addClass(target, className) {
	if (!hasClass(target, className)) {
		target.className += ' ' + className;
	}
}

/**
 * Removes CSS class name from the target DOM element.
 * @param {DOMElement} target Target DOM element.
 * @param {String} className CSS class to remove.
 */
function removeClass(target, className) {
	target.className = target.className.replace(className, '');
}

/**
 * Adds event handler to the target object.
 * @param {Object} obj    Target object.
 * @param {String} type   Name of the event.
 * @param {Function} func Handling function.
 */
function attachEvent(obj, type, func, scope) {
	function handler(e) {
		e = e || window.event;

		if (!e.target) {
			e.target = e.srcElement;
			e.preventDefault = function() {
				this.returnValue = false;
			};
		}

		func.call(scope || window, e);
	}

	if (obj.attachEvent) {
		obj.attachEvent('on' + type, handler);
	} else {
		obj.addEventListener(type, handler, false);
	}
}

/**
 * Looks for a child or parent node which has specified classname.
 * Equivalent to jQuery's $(container).find(".className")
 * @param {Element} target Target element.
 * @param {String} search Class name or node name to look for.
 * @param {Boolean} reverse If set to true, will go up the node tree instead of down.
 * @return {Element} Returns found child or parent element on null.
 */
function findElement(target, search, reverse /* optional */) {
	if (target == null) {
		return null;
	}

	const nodes = reverse !== true ? target.childNodes : [target.parentNode];
	const propertyToFind = { '#': 'id', '.': 'className' }[search.substr(0, 1)] || 'nodeName';
	let expectedValue;
	let found;

	expectedValue = propertyToFind !== 'nodeName'
		? search.substr(1)
		: search.toUpperCase()
	;

	// main return of the found node
	if ((target[propertyToFind] || '').indexOf(expectedValue) !== -1) {
		return target;
	}

	for (let i = 0, l = nodes.length; nodes && i < l && found == null; i++)
		found = findElement(nodes[i], search, reverse);

	return found;
}

/**
 * Looks for a parent node which has specified classname.
 * This is an alias to <code>findElement(container, className, true)</code>.
 * @param {Element} target Target element.
 * @param {String} className Class name to look for.
 * @return {Element} Returns found parent element on null.
 */
function findParentElement(target, className) {
	return findElement(target, className, true);
}

/**
 * Opens up a centered popup window.
 * @param {String} url    URL to open in the window.
 * @param {String} name   Popup name.
 * @param {int} width   Popup width.
 * @param {int} height    Popup height.
 * @param {String} options  window.open() options.
 * @return {Window}     Returns window instance.
 */
function popup(url, name, width, height, options) {
	const x = (screen.width - width) / 2;
	const y = (screen.height - height) / 2;

	options += ', left=' + x +
		', top=' + y +
		', width=' + width +
		', height=' + height
	;
	options = options.replace(/^,/, '');

	const win = window.open(url, name, options);
	win.focus();
	return win;
}

function getElementsByTagName(name) {
	return document.getElementsByTagName(name);
}

/**
 * Finds all elements on the page which could be processes by SyntaxHighlighter.
 */
function findElementsToHighlight(opts) {
	const elements = getElementsByTagName(opts['tagName']);

	// support for <SCRIPT TYPE="syntaxhighlight" /> feature
	if (opts['useScriptTags']) {
		const scripts = getElementsByTagName('script');

		for (let i = 0; i < scripts.length; i++) {
			if (scripts[i].type.match(/^(text\/)?syntaxhighlighter$/)) {
				elements.push(scripts[i]);
			}
		}
	}

	return elements;
}

function create(name) {
	return document.createElement(name);
}

/**
 * Quick code mouse double click handler.
 */
function quickCodeHandler(e) {
	const target = e.target;
	const highlighterDiv = findParentElement(target, '.syntaxhighlight');
	const container = findParentElement(target, '.container');
	const textarea = document.createElement('textarea');

	if (!container || !highlighterDiv || findElement(container, 'textarea')) {
		return;
	}

	// add source class name
	addClass(highlighterDiv, 'source');

	// Have to go over each line and grab it's text, can't just do it on the
	// container because Firefox loses all \n where as Webkit doesn't.
	const lines = container.childNodes;
	let code = [];

	for (let i = 0, l = lines.length; i < l; i++) {
		code.push(lines[i].innerText || lines[i].textContent);
	}

	// using \r instead of \r or \r\n makes this work equally well on IE, FF and Webkit
	code = code.join('\r');

	// For Webkit browsers, replace nbsp with a breaking space
	code = code.replace(/\u00a0/g, ' ');

	// inject <textarea/> tag
	textarea.readOnly = true; // https://github.com/syntaxhighlight/syntaxhighlight/pull/329
	textarea.appendChild(document.createTextNode(code));
	container.appendChild(textarea);

	// preselect all text
	textarea.focus();
	textarea.select();

	// set up handler for lost focus
	attachEvent(textarea, 'blur', function(e) {
		textarea.parentNode.removeChild(textarea);
		removeClass(highlighterDiv, 'source');
	});
}

export default {
	quickCodeHandler: quickCodeHandler,
	create: create,
	popup: popup,
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	attachEvent: attachEvent,
	findElement: findElement,
	findParentElement: findParentElement,
	getSyntaxHighlighterScriptTags: getSyntaxHighlighterScriptTags,
	findElementsToHighlight: findElementsToHighlight
};
