# syntax-highlight web component
This is a web component that implements syntaxhighlight.
This has some advantages over using the global call to syntax highlight. 
For instance all css is contained within the web component so it should not affect
the surrounding page design. It also uses a web worker to do the actual 
highlighting so it doesn't lock up the UI when big code is being highlighted.

#usage
import the script into the page
```html
	<script type="module" src="../src/webcomponent/syntax-highlight.js"></script>
```
wrap the code you want to highlight into the web component
```html
<syntax-highlight language="javascript">
	for (const item of items) {
	item.x += item.y;
	}
</syntax-highlight>
```
Note that you don't have to manually link the theme at the top of the page.
The web component takes care of its own theme.
If you want to use a theme other than the default, just specify this as an attribute to the web component:
```html
<syntax-highlight language="cpp" theme="django">
	for (int index = 0; index < length; index++) {
		item.x += item.y;
	}
```
The web component also allows you to import a code file directly into the web component without 
having to include it inside the webcomponent by specifying it in the `src` attribute of the web component
```html
<syntax-highlight language="JavaScript" src="../src/syntaxhighlight.js">
</syntax-highlight>
```

## attributes
| name       | default | description                                 |
|------------|---------|---------------------------------------------|
| auto-links | true    | enable links in the code to be clickable    |
| first-line | 1       | The line number of the first line of code   |
| gutter     | true    | Shows the line numbers                      |
| highlight  | [ ]     | Array of line numbers to highlight formatted as a json array (e.g. [2,4] ) |
| html-script| false   | Enables mixing HTML with code if you want to highlight HTML that contains scripts |
| smart-tabs | true    | Enables smart tabs                          |
| tab-size   | 4       | The number of spaces for a tab character    |

You can assign these properties either directly on a retrieved element instance (note that you have to use camelCase in that case) :
```html
<syntax-highlight language="JavaScript" src="../src/syntaxhighlight.js">
</syntax-highlight>
<script>
    document.getElementsByTagName('syntax-highlight').autoLinks = false;
</script>
```
Or through an attribute on the element
```html
<syntax-highlight language="JavaScript" src="../src/syntaxhighlight.js" auto-links="false" tab-size="8" higlight="[12, 14]">
</syntax-highlight>
```
For more examples see `examples/webcomponent-example.html`
