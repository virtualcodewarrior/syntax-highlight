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
## npm
```shell
run i --save syntaxhighlight-webcomponent
```
import the js file from `node_modules/syntaxhighlight-webcomponent/dist/webcomponent/syntax-highlight.js` for the minified version or
import the js file from `node_modules/syntaxhighlight-webcomponent/source/webcomponent/syntax-highlight.js` for the un-minified version
## github 
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

## WebComponent
The WebComponent makes use easy, just wrap the code in the web component 
```html
<syntax-highlight language="javascript">
	for (const item of items) {
	item.x += item.y;
	}
</syntax-highlight>
```
Or to import an external source file, just specify its source url
```html
<syntax-highlight language="JavaScript" src="../src/syntaxhighlight.js">
</syntax-highlight>
```
Further documentation about using the highlighter as a web component can be found here:  
- [syntax-highlight webcomponent](./src/webcomponent/README.md).

## Legacy method whole page
To install and use the highlighter on a whole page to automatically highlight code wrapped in `pre` tags or CData in a script, follow this link: 
- [legacy method](./legacy.md).

# Brush API
Every syntaxhighlight brush extends `BaseBrush` class defined in [brush-base](https://github.com/virtualcodewarrior/syntaxhighlight/tree/develop/src/languages/brush-base).
This class exposes the following methods:

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

## Step 2

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

## Step 3

Update `sample.txt` with a decent code sample that includes all of the features that you are highlighting. This is very important!

## Step 4
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
