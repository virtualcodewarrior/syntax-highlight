this is forked from [https://github.com/syntaxhighlighter](https://github.com/syntaxhighlighter)

No development has happened on the parent project for several years and the version located at that repo is currently not building.
I liked this syntax highlighter, but I don't like builds in my web projects, so this will remove any required build steps and replaces them with one optional minify build step.
I also converted it in a mono repo which makes it easier to fork this. 
I also reduced the dependencies because I don't need webpack etc.
This does mean however that it will only support 'modern' browsers (i.e., anything released in the last 2 years).
The optional build step is only needed when you want to minify the code, else you can just import ./src/syntaxhighlight.js directly.
This code is compatible with es6 import only unless you use something like webpack to make it compatible with older (non standard) importing schemes.
I didn't test if this works in node if you want to use it with some kind of server side rendering, but it should work if using the brushes directly. 

# syntaxhighlight

Syntaxhighlighter used to be THE client side highlighter for the web and web-apps! It's been around since 2004 and it's used virtually everywhere to seamlessly highlight code for presentation purposes.
However, it has had no major development happen to it in the last 6 years and has fallen into disrepair. It no longer builds and any PRs going back to 2013 have not been merged.

This is sort of a rebirth of this project forked from this 6 year old code.
I cleaned up most of the code and bring it into the 2020's. 
I also removed all required build steps, so we are only left with an optional build step to make a minified version of this code.

Brushes now use dynamic imports and don't have to be provided in advance. 
This did get rid of the aliases however, since it now uses the brush names as a load key.
You can also still add brushes manually by using registerBrush. 

![Screenshot](screenshot.png)

# Installation
Just clone the project to your disk using
```shell
git clone https://github.com/virtualcodewarrior/syntaxhighlight.git
```
This should give you a working version of the highlighter.
If you want to run tests or build a minified version, you will have to install some dev dependencies using 
```shell
npm install
```
from the project root directory

# Usage

## Basic Steps

To get syntaxhighlight to work on you page, you need to do the following:

Import into your page and call highlight with optional global configuration.
If you have any custom brushes, import them with registerBrush. Also add a theme.
```html
<script type="module">
	import syntaxHighlight, { registerBrush } from '../src/syntaxhighlight.js';
    registerBrush(MyBrush, 'my-brush-name');
    syntaxHighlight.highlight({});
</script>
<link rel="stylesheet" type="text/css" href="../src/themes/theme-default/themes.css>"
```
## `<pre />` method

:grinning: **ADVANTAGES** :grinning:

Works everywhere, graceful fallback if there are script problems, shows up in all RSS readers as regular `<pre />`

:weary: **PROBLEMS** :weary:

Major issue with this method is that all right angle brackets **must be HTML escaped**, eg all `<` must be replaced with `&lt;` This will ensure correct rendering.

syntaxhighlight looks for `<pre />` tags which have a specially formatted `class` attribute. The format of the attribute is the same as the CSS `style` attribute. The only required parameter is `brush`.

Here’s an example:

```html
<pre class="brush: javascript">
function foo()
{
}
</pre>

<script type="module">
	import syntaxHighlight, { registerBrush } from '../src/syntaxhighlight.js';
	registerBrush(MyBrush, 'my-brush-name');
	syntaxHighlight.highlight({});
</script>
<link rel="stylesheet" type="text/css" href="../src/themes/theme-default/themes.css>"
```

## `<script />` method

The benefit of this method is ability to place virtually anything inside the CDATA **without having to escape anything***, so this allows for a straight 'cut and paste' experience from your favorite text editor.

:grinning: **ADVANTAGES** :grinning:

Doesn’t require escaping of the right angle bracket.

:weary: **PROBLEMS** :weary:

1.  No fallback, `<script />` tag is stripped out by most RSS readers, so if you are using syntaxhighlight on a blog, you are better off with the `<pre />` method.
2.  If you include a closing script tag, eg `</script>`, even inside CDATA block, most browsers will incorrectly close `<script type="text/syntaxhighlight">` tag prematurely.

syntaxhighlight looks for `<script type="syntaxhighlight" />` which have a specially formatted `class` attribute. The format of the attribute is the same as the CSS `style` attribute. The only required parameter is `brush`.

Here’s an example (**Please note necessary CDATA tag**):

```html
<script type="text/syntaxhighlight" class="brush: js"><![CDATA[
  function foo()
  {
      if (counter <= 10)
          return;
      // it works!
  }
]]></script>

<script type="module">
	import syntaxHighlight, { registerBrush } from '../src/syntaxhighlight.js';
	registerBrush(MyBrush, 'my-brush-name');
	syntaxHighlight.highlight({});
</script>
<link rel="stylesheet" type="text/css" href="../src/themes/theme-default/themes.css>"
```

## Strange tags in the output?

Are you expecting

```java
Map<String, String> v = new HashMap<String, String>();
```

but getting?

```java
Map<string, string=""> v = new HashMap<string, string="">();
</string,></string,>
```

If the answer is yes, read on.
If you are using `<pre />` tags, unfortunately you have to replace all `<` characters with `&lt;`, otherwise browsers think you have unclosed HTML tags.

Your actual HTML code should be:

```html
<pre class="brush: java">
Map&lt;String, String> v = new HashMap&lt;String, String>();
</pre>
```

or use the `<script />` tag instead:

```html
<script type="text/syntaxhighlight" class="brush: java"><![CDATA[
Map<String, String> v = new HashMap<String, String>();
]]></script>
```

# Configuration

## Global Configuration

You can configure all highlight instances at once if you pass in properties to highlight. For example:

```html
<script type="module">
	import syntaxHighlight, { registerBrush } from '../src/syntaxhighlight.js';
	registerBrush(MyBrush, 'my-brush-name');
    syntaxHighlight.highlight({
		className: 'custom-class-name'
    });
</script>
```

## Per Element Configuration

Alternatively you can pass the same options to each element you want to configure. Key/value pairs are specified in the format similar to CSS and you have to use `dash-case`.

```html
<pre class="brush: php; auto-links: false; first-line: 10; highlight: [2, 4]">
  /**
    * https://github.com/syntaxhighlight
    */
  echo("https://github.com/syntaxhighlight");
</pre>
```
# Options

* `auto-links` (Default `true`) - Allows you to turn detection of links in the highlighted element on and off. If the option is turned off, URLs won’t be clickable.
* `class-name` (Default `null`) - Allows you to add a custom class (or multiple classes) to every highlighter element that will be created on the page.
* `first-line` (Default `1`) - Allows you to change the first (starting) line number.
* `gutter` (Default `true`) - Allows you to turn gutter with line numbers on and off.
* `highlight`(Default `null`) - Allows you to highlight one or more lines to focus user’s attention. When specifying as a parameter, you have to pass an array looking value, like [1, 2, 3] or just an number for a single line. If you are changing syntaxhighlight.defaults['highlight'], you can pass a number or an array of numbers.
* `html-script`(Default `false`) - Allows you to highlight a mixture of HTML/XML code and a script which is very common in web development. Setting this value to true requires that you have shBrushXml.js loaded and that the brush you are using supports this feature.
* `smart-tabs` (Default `true`) - Allows you to turn smart tabs feature on and off.
* `tab-size` (Default `4`) - Allows you to adjust tab size.

# Code use

# Using a Brush

This works in the browser and (possibly) in Node.js.

```js
import PhpBrush from 'src/languages/brush-php/brush.js';

const brush = new PhpBrush();
const html = brush.getHtml('/* hello foo bar world! /*', {gutter: false});
```

# Using syntaxhighlight

This only works in the browser.

```js
import syntaxHighlight, {registerBrush} from 'src/syntaxhighlight.js';
import PhpBrush from 'src/languages/brush-php/brush.js';

registerBrush(PhpBrush);
syntaxHighlight.highlight({gutter: false});
```

# Brush API

Every syntaxhighlight brush extends `BaseBrush` class defined in [brush-base](https://github.com/virtualcodewarrior/syntaxhighlight/src/languages/brush-base).

* `getKeywords(str)`
* `forHtmlScript(regexGroup)`
* `getHtml(code, params = {})`

# syntaxhighlight API

`syntaxhighlight` module exposes these methods:

* `default` (aka `syntaxHighlight`)
    * `highlight(params = {}, element = null)`
* `registerBrush(BrushClass)`

#Making a brush

Developing a custom brush allows you to easily extend syntaxhighlight to support the syntax that isn't [[currently available|Brushes and Themes]]. This process is rather simple and consists of 4 parts:

## Step 1

The best way to make a new brush is to start by copying an existing one.

```
$ cp src/languages/brush-javascript src/languages/brush-my-lang
$ cd src/languages/brush-my-lang
```

# Step 2

Modify the template to fit your needs.

```js
import BrushBase from '../brush-base/brush-base.js';
import { commonRegExp } from '../../utilities/syntaxhighlight-regex/syntaxhighlight-regex.js';

// you can have as many custom, space separated sets as you want
const functions = 'func1 func2';
const keywords = 'keyword1 keyword2';
const constants = 'CONST1 CONTS2';

export default class Brush extends BrushBase {
  constructor() {
    super();

    // The order of `regexList` doesn't matter, the following classes
    // are defined with every brush: plain, comments, string, keyword, 
    // preprocessor, variable, value, functions, constants, script, 
    // script_background, color1, color2, color3
    this.regexList = [
      {regex: commonRegExp.singleLineCComments, css: 'comments'},
      {regex: commonRegExp.multiLineCComments, css: 'comments'},
      {regex: commonRegExp.doubleQuotedString, css: 'string'},
      {regex: commonRegExp.singleQuotedString, css: 'string'},
      {regex: /\$\w+/g, css: 'variable'},
      {regex: new RegExp(this.getKeywords(functions), 'gmi'), css: 'functions'},
      {regex: new RegExp(this.getKeywords(constants), 'gmi'), css: 'constants'},
      {regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword'}
    ];

    this.forHtmlScript(commonRegExp.phpScriptTags);
  }
}
```

# Step 3

Update `sample.txt` with a decent code sample that includes all of the features that you are highlighting. This is very important!

# Step 4
Run the tests
```shell
npm run test
```

# building
If you just want to use the syntax highlighter you don't need to do anything but if you want to build a minified version
just run
```shell
npm run build
```
I added all dependent code to this one repo to make it easier to clone this project.
This also simplifies the whole setup process.

Brushes that are included will now be dynamically imported when used so no need to specify which one you use in advance. Do note that
it no longer supports aliases for brush names. If you really need alias brushes, just add your own.
There is currently one included alias brush which is actionscript3 which is an alias of as3. You can check out `languages/brush-actionscript3/brush.js` to see how easy this is to do.

To add new brushes you can put them into the `languages` folder or import them manually using
`registerBrush`.

# License
The original authors have copyright to their original code and uses the least restrictive original license. 
Any new code is MIT Licensed
