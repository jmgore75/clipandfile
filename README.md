# WARNING
**This `ieCompatibility` branch contains a modified version of the v2.0.2 codebase for ZeroClipboard.  It is primarily intended to support IE in compatibility view, with additional features.  Please see [`ZeroClipboard`](https://github.com/zeroclipboard/zeroclipboard) for the original.**


# ClipAndFile

The ClipAndFile library provides an easy way to copy text to the clipboard or save a file using an invisible [Adobe Flash](http://en.wikipedia.org/wiki/Adobe_Flash) movie and a [JavaScript](http://en.wikipedia.org/wiki/JavaScript) interface. The the user interface is left entirely up to you. 

This is achieved by automatically floating the invisible movie on top of a [DOM](http://en.wikipedia.org/wiki/Document_Object_Model) element of your choice. Standard mouse events are even propagated out to your DOM element, so you can still have rollover and mousedown effects.


## Limitations

Note that, due to browser and Flash security restrictions, this clipboard injection can _**ONLY**_ occur when the user clicks on the invisible Flash movie. A simulated `click` event from JavaScript will not suffice as this would enable [clipboard poisoning](http://www.computerworld.com/s/article/9117268/Adobe_patches_Flash_clickjacking_and_clipboard_poisoning_bugs).


## Simple Example

```html
<html>
  <body>
    <button id="copy-button" data-clipboard-text="Copy Me!" title="Click to copy me.">Copy to Clipboard</button>
    <button id="save-button" data-clipboard-text="Save Me!" data-clipboard-file="Save.txt" title="Click to save me.">Save to File</button>
    <script src="ClipAndFile.js"></script>
    <script src="main.js"></script>
  </body>
</html>
```

```js
// main.js
var copy_client = new ClipAndFile( document.getElementById("copy-button") );

copy_client.on( "ready", function( readyEvent ) {
  // alert( "ClipAndFile SWF is ready!" );

  copy_client.on( "aftercopy", function( event ) {
    // `this` === `copy_client`
    // `event.target` === the element that was clicked
    event.target.style.display = "none";
    alert("Copied text to clipboard: " + event.data["text/plain"] );
  } );
} );

var save_client = new ClipAndFile( document.getElementById("copy-button") );

save_client.on( "ready", function( readyEvent ) {
  // alert( "ClipAndFile SWF is ready!" );

  save_client.on( "aftercopy", function( event ) {
    // `this` === `save_client`
    // `event.target` === the element that was clicked
    event.target.style.display = "none";
    alert("Saved text to file: " + event.data.file );
  } );
} );
```

See [docs/instructions.md](docs/instructions.md) for more advanced options in using the library on your site.
See [docs/api/ClipAndFile.md](docs/api/ClipAndFile.md) for the complete API documentation.


## Support

This library is fully compatible with Flash Player 11.0.0 and above, which requires
that the clipboard copy operation be initiated by a user click event inside the
Flash movie. This is achieved by automatically floating the invisible movie on top
of a [DOM](http://en.wikipedia.org/wiki/Document_Object_Model) element of your
choice. Standard mouse events are even propagated out to your DOM element, so you
can still have rollover and mousedown effects.

Definitely works in IE8+ and all of the evergreen browsers.
Should also work in IE7 if you provide a polyfill for the global `JSON` object, e.g.
[JSON 2](https://github.com/douglascrockford/JSON-js/blob/master/json2.js) or
[JSON 3](http://bestiejs.github.io/json3/).


## Contributing

see [CONTRIBUTING.md](CONTRIBUTING.md)


## Releases

see [releases](https://github.com/jmgore75/clipandfile/releases)

