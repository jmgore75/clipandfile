package {

	import flash.display.Stage;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.display.StageQuality;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.system.Security;
    
    import flash.utils.ByteArray; 
    import flash.net.FileReference;

	/**
	 * The ClipAndFile class creates a simple Sprite button that will put
	 * text in the user's clipboard or save a file when clicked.
	 */
	[SWF(widthPercent = "100%", heightPercent = "100%", backgroundColor = "#FFFFFF")]
	public class ClipAndFile extends Sprite {
		/**
		 * Function through which JavaScript events are emitted. Accounts for scenarios
		 * in which ClipAndFile is used via AMD/CommonJS module loaders, too.
		 */
		private var jsEmitter : String = null;

		/**
		 * JavaScript proxy object.
		 */
		private var jsProxy : JsProxy = null;

		/**
		 * Clipboard proxy object.
		 */
		private var clipboard : ClipboardInjector = null;

		/**
		 * @constructor
		 */
		public function ClipAndFile() {
			// The JIT Compiler does not compile constructors, so ANY
			// cyclomatic complexity higher than 1 is discouraged.
			this.ctor();
		}

		/**
		 * The real constructor.
		 *
		 * @return `undefined`
		 */
		private function ctor() : void {
			// If the `stage` is available, begin!
			if (stage) {
				this.init();
			} else {
				// Otherwise, wait for the `stage`....
				this.addEventListener(Event.ADDED_TO_STAGE, this.init);
			}
		}

		/**
		 * Initialize the class when the Stage is ready.
		 *
		 * @return `undefined`
		 */
		private function init() : void {
			// Remove the event listener, if any
			this.removeEventListener(Event.ADDED_TO_STAGE, this.init);

			// Get the flashvars
			var flashvars : Object; // NOPMD
			flashvars = XssUtils.filterToFlashVars(this.loaderInfo.parameters);

			// Configure the SWF object's ID
			var swfObjectId : String = "global-clipandfile-flash-bridge";
			if (flashvars.swfObjectId && typeof flashvars.swfObjectId === "string") {
				var swfId = XssUtils.sanitizeString(flashvars.swfObjectId);

				// Validate the ID against the HTML4 spec for `ID` tokens.
				if (/^[A-Za-z][A-Za-z0-9_:\-\.]*$/.test(swfId)) {
					swfObjectId = swfId;
				}
			}

			// Allow the SWF object to communicate with a page on a different origin than its own (e.g. SWF served from CDN)
			if (flashvars.trustedOrigins && typeof flashvars.trustedOrigins === "string") {
				var origins : Array = XssUtils.sanitizeString(flashvars.trustedOrigins).split(",");
				Security.allowDomain.apply(Security, origins);
			}

			// Enable use of the fancy "Desktop" clipboard, even on Linux where it is known to suck
			var forceEnhancedClipboard : Boolean = false;
			if (flashvars.forceEnhancedClipboard === "true" || flashvars.forceEnhancedClipboard === true) {
				forceEnhancedClipboard = true;
			}

			this.jsEmitter =
				"(function(eventObj) {\n" +
				"  var objectId = '" + swfObjectId + "',\n" +
				"      ZC = null,\n" +
				"      swf = null;\n" +
				"  if (typeof ClipAndFile === 'function' && typeof ClipAndFile.emit === 'function') {\n" +
				"    \nZC = ClipAndFile;\n" +
				"  }\n" +
				"  else {\n" +
				"    swf = document[objectId] || document.getElementById(objectId);\n" +
				"    if (swf && typeof swf.ClipAndFile === 'function' && typeof swf.ClipAndFile.emit === 'function') {\n" +
				"      ZC = swf.ClipAndFile;\n" +
				"    }\n" +
				"  }\n" +
				"  if (!ZC) {\n" +
				"    throw new Error('ERROR: ClipAndFile SWF could not locate ClipAndFile JS object!\\n" +
				"Expected element ID: ' + objectId);\n" +
				"  }\n" +
				"  return ZC.emit(eventObj);\n" +
				"})";

			// Create an invisible "button" and transparently fill the entire Stage
			var button : Sprite = this.prepareUI();

			// Configure the clipboard injector
			this.clipboard = new ClipboardInjector(forceEnhancedClipboard);

			// Establish a communication line with JavaScript
			this.jsProxy = new JsProxy(swfObjectId);

			// Only proceed if this SWF is hosted in the browser as expected
			if (this.jsProxy.isComplete()) {

				// Add the MouseEvent listeners
				this.addMouseHandlers(button);

				// Expose the external functions
				this.jsProxy.addCallback(
					"setHandCursor",
					function (enabled : Boolean) {
					button.useHandCursor = enabled === true;
				});

				// Signal to the browser that we are ready
				this.emit("ready");
			} else {
				// Signal to the browser that something is wrong
				this.emit("error", {
					name : "flash-unavailable"
				});
			}
		}

		/**
		 * Prepare the Stage and Button.
		 *
		 * @return Button
		 */
		private function prepareUI() : Sprite {
			// Set the stage!
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.EXACT_FIT;
			stage.quality = StageQuality.BEST;

			// Create an invisible "button" and transparently fill the entire Stage
			var button : Sprite = new Sprite();
			button.graphics.beginFill(0xFFFFFF);
			button.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
			button.alpha = 0.0;

			// Act like a button. This includes:
			//  - Showing a hand cursor by default
			//  - Receiving click events
			//  - Receiving keypress events of space/"Enter" as click
			//    events IF AND ONLY IF the Sprite is focused.
			button.buttonMode = true;

			// Override the hand cursor default
			button.useHandCursor = false;

			// Add the invisible "button" to the stage!
			this.addChild(button);

			// Return the button for adding event listeners
			return button;
		}

		/**
		 * Clears the clipboard and sets new clipboard text. It gets this from the "_clipData"
		 * variable on the JavaScript side. Once the text has been placed in the clipboard, it
		 * then signals to the JavaScript that it is done.
		 *
		 * @return `undefined`
		 */
		private function onClick(event : MouseEvent) : void {
			var clipData : Object; // NOPMD
			var fileData : ByteArray;
			var clipInjectSuccess : Object = {}; // NOPMD

			// Allow for any "UI preparation" work before the "copy" event begins
			this.emit("beforecopy");

			// Request pending clipboard data from the page
			clipData = this.emit("copy");

			if (clipData.filename) {
				if (clipData.b64) {
					fileData = b64ToBytes(clipData.file);
				} else {
					fileData = strToBytes(clipData.file);
				}
				clipInjectSuccess = saveFile(clipData.filename, fileData);
			} else {
				// Inject all pending data into the user's clipboard
				clipInjectSuccess = this.clipboard.inject(clipData);
			}

			// Compose and serialize a results object, send it back to the page
			this.emit(
				"aftercopy", {
				success : clipInjectSuccess,
				data : clipData
			});
		}

		private function saveFile(fileName : String, fileData : ByteArray) : Object  { // NOPMD
			var results : Object = {}; // NOPMD
			var fileRef : FileReference = new FileReference();
			results.file = true;
			fileRef.save(fileData, fileName);
			return results;
		}

		/**
		 * Emit events to JavaScript.
		 *
		 * @return `undefined`, or the new "_clipData" object
		 */
		private function emit(
			eventType : String,
			eventObj : Object = null // NOPMD
		) : Object { // NOPMD
			if (eventObj == null) {
				eventObj = {};
			}
			eventObj.type = eventType;

			var result : Object = undefined; // NOPMD
			if (this.jsProxy.isComplete()) {
				result = this.jsProxy.call(this.jsEmitter, [eventObj]);
			} else {
				this.jsProxy.send(this.jsEmitter, [eventObj]);
			}
			return result;
		}

		/**
		 * Signals to the page that a MouseEvent occurred.
		 *
		 * @return `undefined`
		 */
		private function onMouseEvent(event : MouseEvent) : void {
			var evtData : Object = {}; // NOPMD

			// If an event is passed in, return what modifier keys are pressed, etc.
			if (event) {
				var props : Object; // NOPMD
				props = {
					"altKey" : "altKey",
					"commandKey" : "metaKey",
					"controlKey" : "ctrlKey",
					"shiftKey" : "shiftKey",
					"clickCount" : "detail",
					"movementX" : "movementX",
					"movementY" : "movementY",
					"stageX" : "_stageX",
					"stageY" : "_stageY"
				};

				for (var prop in props) {
					if (event.hasOwnProperty(prop) && event[prop] != null) {
						evtData[props[prop]] = event[prop];
					}
				}
				evtData.type = "_" + event.type.toLowerCase();
				evtData._source = "swf";
			}

			this.emit(evtData.type, evtData);
		}

		/**
		 * Add mouse event handlers to the button.
		 *
		 * @return `undefined`
		 */
		private function addMouseHandlers(button : Sprite) : Sprite {
			button.addEventListener(MouseEvent.MOUSE_MOVE, this.onMouseEvent);
			button.addEventListener(MouseEvent.MOUSE_OVER, this.onMouseEvent);
			button.addEventListener(MouseEvent.MOUSE_OUT, this.onMouseEvent);
			button.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseEvent);
			button.addEventListener(MouseEvent.MOUSE_UP, this.onMouseEvent);
			button.addEventListener(MouseEvent.CLICK, this.onClick);
			button.addEventListener(MouseEvent.CLICK, this.onMouseEvent);
			return button;
		}

		private static const BASE64_CHARS : String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		private static function strToBytes(str : String) : ByteArray {
			var utf8 : ByteArray = new ByteArray(); // NOPMD

			utf8.writeByte(0xEF);
			utf8.writeByte(0xBB);
			utf8.writeByte(0xBF);
			utf8.writeUTFBytes(str);

			utf8.position = 0;
			return utf8;
		}

		private static function b64ToBytes(data : String) : ByteArray {
			var output : ByteArray = new ByteArray();
			var dataBuffer : Array = new Array(4);
			var outputBuffer : Array = new Array(3);

			for (var i : uint = 0; i < data.length; i += 4) {
				for (var j : uint = 0; j < 4 && i + j < data.length; j++) {
					dataBuffer[j] = BASE64_CHARS.indexOf(data.charAt(i + j));
				}

				// Decode data buffer back into bytes
				outputBuffer[0] = (dataBuffer[0] << 2) + ((dataBuffer[1] & 0x30) >> 4);
				outputBuffer[1] = ((dataBuffer[1] & 0x0f) << 4) + ((dataBuffer[2] & 0x3c) >> 2);
				outputBuffer[2] = ((dataBuffer[2] & 0x03) << 6) + dataBuffer[3];

				// Add all non-padded bytes in output buffer to decoded data
				for (var k : uint = 0; k < outputBuffer.length; k++) {
					if (dataBuffer[k + 1] == 64)
						break;
					output.writeByte(outputBuffer[k]);
				}
			}

			output.position = 0;
			return output;
		}
	}
}
