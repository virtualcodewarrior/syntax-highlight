import optsParser from '../utilities/opts-parser/opts-parser.js';
import { Match, applyRegexList } from '../utilities/syntaxhighlighter-match/index.js';
import Renderer from '../utilities/syntaxhighlighter-html-renderer/index.js';
import { commonRegExp } from '../utilities/syntaxhighlighter-regex/index.js';
import utils from './utils.js';
import transformers from './transformers/index.js';
import dom from './dom.js';
import config from './config.js';
import defaults from './defaults.js';
import HtmlScript from './html_script.js';
import BrushBase from '../languages/brush-base/brush-base.js';

const sh = {
	Match,
	Highlighter: BrushBase,

	config,
	regexLib: commonRegExp,

	/** Internal 'global' variables. */
	vars: {
		discoveredBrushes: null,
		highlighters: {}
	},

	/** This object is populated by user included external brush files. */
	brushes: {},

	/**
	 * Finds all elements on the page which should be processes by SyntaxHighlighter.
	 *
	 * @param {Object} globalParams   Optional parameters which override element's
	 *                  parameters. Only used if element is specified.
	 *
	 * @param {Object} element  Optional element to highlight. If none is
	 *              provided, all elements in the current document
	 *              are returned which qualify.
	 *
	 * @return {Array}  Returns list of <code>{ target: DOMElement, params: Object }</code> objects.
	 */
	findElements: function(globalParams, element) {
		var elements = element ? [element] : utils.toArray(document.getElementsByTagName(sh.config.tagName)),
			conf = sh.config,
			result = []
		;

		// support for <SCRIPT TYPE="syntaxhighlighter" /> feature
		elements = elements.concat(dom.getSyntaxHighlighterScriptTags());

		if (elements.length === 0) {
			return result;
		}

		for (var i = 0, l = elements.length; i < l; i++) {
			var item = {
				target: elements[i],
				// local params take precedence over globals
				params: optsParser.defaults(optsParser.parse(elements[i].className), globalParams)
			};

			if (item.params['brush'] == null) {
				continue;
			}

			result.push(item);
		}

		return result;
	},

	/**
	 * Shorthand to highlight all elements on the page that are marked as
	 * SyntaxHighlighter source code.
	 *
	 * @param {Object} globalParams   Optional parameters which override element's
	 *                  parameters. Only used if element is specified.
	 *
	 * @param {Object} element  Optional element to highlight. If none is
	 *              provided, all elements in the current document
	 *              are highlighted.
	 */
	highlight: async function(globalParams, element) {
		var elements = sh.findElements(globalParams, element),
			propertyName = 'innerHTML',
			brush = null,
			renderer,
			conf = sh.config
		;

		if (elements.length === 0) {
			return;
		}

		for (var i = 0, l = elements.length; i < l; i++) {
			var element = elements[i],
				target = element.target,
				params = element.params,
				brushName = params.brush,
				brush,
				matches,
				code
			;

			if (brushName == null) {
				continue;
			}

			brush = await findBrush(brushName);

			if (!brush) {
				continue;
			}

			// local params take precedence over defaults
			params = optsParser.defaults(params || {}, defaults);
			params = optsParser.defaults(params, config);

			// Instantiate a brush
			if (params['html-script'] === true || defaults['html-script'] === true) {
				brush = new HtmlScript(findBrush('xml'), brush);
				brushName = 'htmlscript';
			} else {
				brush = new brush();
			}

			code = target[propertyName];

			// remove CDATA from <SCRIPT/> tags if it's present
			if (conf.useScriptTags) {
				code = stripCData(code);
			}

			// Inject title if the attribute is present
			if ((target.title || '') !== '') {
				params.title = target.title;
			}

			params['brush'] = brushName;

			code = transformers(code, params);
			matches = applyRegexList(code, brush.regexList, params);
			renderer = new Renderer(code, matches, params);

			element = dom.create('div');
			element.innerHTML = renderer.getHtml();

			// id = utils.guid();
			// element.id = highlighters.id(id);
			// highlighters.set(id, element);

			if (params.quickCode) {
				dom.attachEvent(dom.findElement(element, '.code'), 'dblclick', dom.quickCodeHandler);
			}

			// carry over ID
			if ((target.id || '') !== '') {
				element.id = target.id;
			}

			target.parentNode.replaceChild(element, target);
		}
	}
}; // end of sh

/**
 * Displays an alert.
 * @param {String} str String to display.
 */
function alert(str) {
	window.alert('SyntaxHighlighter\n\n' + str);
}

/**
 * Finds a brush by its alias.
 *
 * @param {String} alias    Brush alias.
 * @param {Boolean} showAlert Suppresses the alert if false.
 * @return {Brush}        Returns bursh constructor if found, null otherwise.
 */
async function findBrush(alias, showAlert) {
	sh.vars.discoveredBrushes = sh.vars.discoveredBrushes ?? {};
	let brush = sh.vars.discoveredBrushes[alias];
	if (!brush) {
		const result = await import(`../languages/brush-${alias}/brush.js`);
		if (result) {
			sh.vars.discoveredBrushes[alias] = brush = result.default;
		}
	}

	return brush;
}

/**
 * Strips <![CDATA[]]> from <SCRIPT /> content because it should be used
 * there in most cases for XHTML compliance.
 * @param {String} original Input code.
 * @return {String} Returns code without leading <![CDATA[]]> tags.
 */
function stripCData(original) {
	var left = '<![CDATA[',
		right = ']]>',
		// for some reason IE inserts some leading blanks here
		copy = utils.trim(original),
		changed = false,
		leftLength = left.length,
		rightLength = right.length
	;

	if (copy.indexOf(left) === 0) {
		copy = copy.substring(leftLength);
		changed = true;
	}

	var copyLength = copy.length;

	if (copy.indexOf(right) === copyLength - rightLength) {
		copy = copy.substring(0, copyLength - rightLength);
		changed = true;
	}

	return changed ? copy : original;
}

let brushCounter = 0;

export default sh;
export const registerBrush = brush => sh.brushes['brush' + brushCounter++] = brush.default || brush;
export const clearRegisteredBrushes = () => {
	sh.brushes = {};
	brushCounter = 0;
}
