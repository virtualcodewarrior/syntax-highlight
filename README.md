this is forked from [https://github.com/syntaxhighlighter](https://github.com/syntaxhighlighter)
No development has happened on the above project for several years and version located at that repo is currently not building.
I liked this syntax highlighter, but I don't like builds in my web projects, so this will remove any required build steps, convert it in a mono repo which makes
it easier to fork this. That will also reduce the dependencies because I don't need webpack, babel etc.
This does mean that it will only support 'modern' browsers.

# SyntaxHighlighter no-build edition

SyntaxHighlighter is THE client side highlighter for the web and web-apps! It's been around since 2004 and it's used virtually everywhere to seamlessly highlight code for presentation purposes.

<img alt="screenshot" src="screenshot.png" style="width: 640px;"/>

The history of this project predates majority of the common web technologies and it has been a challenge to dedicate time and effort to keep it up to date. Everything used to be in one file and assign `window` variables... Horrors!

SyntaxHighlighter is currently used and has been used in the past by Microsoft, Apache, Mozilla, Yahoo, Wordpress, Bug Labs, Freshbooks and many other companies and blogs.

## :zap: Reporting an issue? See [Filing Issues]. :zap:

## Get Started

* [Building] instructions
* [Usage] instructions
* Be sure to read the [Caveats]

## FAQ

* v4 is fully compatible with old brushes and themes, see [Building] instructions.
* The `?` was completely removed for cleaner, more seamless experience.
* You still have to HTML escape `<` when using `<pre/>` tags.

# License
The original authors have copyright to their original code. 
MIT
