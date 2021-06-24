import optsParser from './utilities/opts-parser/opts-parser.js';
import { Match, applyRegexList } from './utilities/syntaxhighlighter-match/syntaxhighlighter-match.js';
import Renderer from './utilities/syntaxhighlighter-html-renderer/syntaxhighlighter-html-renderer.js';
import { commonRegExp } from './utilities/syntaxhighlighter-regex/syntaxhighlighter-regex.js';
import utils from './utils.js';
import transformers from './transformers/index.js';
import dom from './dom.js';
import config from './config.js';
import defaults from './defaults.js';
import HtmlScript from './html_script.js';
import BrushBase from './languages/brush-base/brush-base.js';

let findBrush = null;
let stripCData = null;

const dasherizeString = (value) =>
	value
		.replace(/^([A-Z])/g, (_, character) => character.toLowerCase())
		.replace(/([A-Z])/g, (_, character) => `-${character.toLowerCase()}`);

const dasherizeObject = (value) => {
	const result = {};
	Object.keys(value).forEach((key) => { result[dasherizeString(key)] = value[key]; });
	return result;
};

const sh = {
	Match,
	Highlighter: BrushBase,

	config,
	regexLib: commonRegExp,

	/** Internal 'global' variables. */
	vars: {
		discoveredBrushes: null,
		highlighters: {},
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
	 * @returns {Array}  Returns list of <code>{ target: DOMElement, params: Object }</code> objects.
	 */
	findElements(globalParams, element) {
		let elements = element ? [element] : utils.toArray(document.getElementsByTagName(sh.config.tagName));
		const result = [];

		// support for <SCRIPT TYPE="syntaxhighlighter" /> feature
		elements = elements.concat(dom.getSyntaxHighlighterScriptTags());

		if (elements.length === 0) {
			return result;
		}

		for (let index = 0, length = elements.length; index < length; index++) {
			const item = {
				target: elements[index],
				// local params take precedence over globals
				params: optsParser.defaults(optsParser.parse(elements[index].className), globalParams),
			};

			if (item.params['brush'] !== null) {
				result.push(item);
			}
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

	async highlight(globalParams, element) {
		globalParams = globalParams ? dasherizeObject(globalParams) : globalParams;
		const elements = sh.findElements(globalParams, element);
		const propertyName = 'innerHTML';
		let renderer;
		const conf = sh.config;

		if (elements.length === 0) {
			return;
		}

		for (let index = 0, length = elements.length; index < length; index++) {
			let elementAtIndex = elements[index];
			const target = elementAtIndex.target;
			let params = elementAtIndex.params;
			let brushName = params.brush;
			let Brush;
			let matches;
			let code;

			if (brushName) {
				Brush = await findBrush(brushName);

				if (Brush) {
					// local params take precedence over defaults
					params = optsParser.defaults(params || {}, defaults);
					params = optsParser.defaults(params, config);

					// Instantiate a brush
					if (params['html-script'] === true || defaults['html-script'] === true) {
						Brush = new HtmlScript(await findBrush('xml'), Brush);
						brushName = 'htmlscript';
					} else {
						Brush = new Brush();
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
					matches = applyRegexList(code, Brush.regexList, params);
					renderer = new Renderer(code, matches, params);

					elementAtIndex = dom.create('div');
					elementAtIndex.innerHTML = renderer.getHtml();

					if (params.quickCode) {
						dom.attachEvent(dom.findElement(elementAtIndex, '.code'), 'dblclick', dom.quickCodeHandler);
					}

					// carry over ID
					if ((target.id || '') !== '') {
						elementAtIndex.id = target.id;
					}

					target.parentNode.replaceChild(elementAtIndex, target);
				}
			}
		}
	},
}; // end of sh

/**
 * Finds a brush by its alias.
 *
 * @param {String} alias    Brush alias.
 * @returns {Brush}        Returns brush constructor if found, null otherwise.
 */
findBrush = async(alias) => {
	sh.vars.discoveredBrushes = sh.vars.discoveredBrushes ?? {};
	let brush = sh.vars.discoveredBrushes[alias];
	if (!brush) {
		const result = await import(`./languages/brush-${alias}/brush.js`);
		if (result) {
			sh.vars.discoveredBrushes[alias] = brush = result.default;
		}
	}
	brush.className = brush.className || alias;
	brush.brushName = brush.className || alias.toLowerCase();

	return brush;
};

/**
 * Strips <![CDATA[]]> from <SCRIPT /> content because it should be used
 * there in most cases for XHTML compliance.
 * @param {String} original Input code.
 * @returns {String} Returns code without leading <![CDATA[]]> tags.
 */
stripCData = (original) => {
	const left = '<![CDATA[';
	const right = ']]>';
	// for some reason IE inserts some leading blanks here
	let copy = utils.trim(original);
	let changed = false;
	const leftLength = left.length;
	const rightLength = right.length;

	if (copy.indexOf(left) === 0) {
		copy = copy.substring(leftLength);
		changed = true;
	}

	const copyLength = copy.length;

	if (copy.indexOf(right) === copyLength - rightLength) {
		copy = copy.substring(0, copyLength - rightLength);
		changed = true;
	}

	return changed ? copy : original;
};

export default sh;
export const registerBrush = (brush, name) => {
	sh.vars.discoveredBrushes = sh.vars.discoveredBrushes || {};
	sh.vars.discoveredBrushes[name] = brush.default ?? brush;
};
