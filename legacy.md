## legacy method Basic Steps

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

