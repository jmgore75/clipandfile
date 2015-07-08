/**
 * Creates a new ClipAndFile client instance.
 * Optionally, auto-`clip` an element or collection of elements.
 *
 * @constructor
 */
ClipAndFile._createClient = function(/* elements */) {
  // Invoke the real constructor
  _clientConstructor.apply(this, _args(arguments));
};


/**
 * Register an event listener to the client.
 *
 * @returns `this`
 */
ClipAndFile.prototype.on = function(/* eventType, listener */) {
  return _clientOn.apply(this, _args(arguments));
};


/**
 * Unregister an event handler from the client.
 * If no `listener` function/object is provided, it will unregister all handlers for the provided `eventType`.
 * If no `eventType` is provided, it will unregister all handlers for every event type.
 *
 * @returns `this`
 */
ClipAndFile.prototype.off = function(/* eventType, listener */) {
  return _clientOff.apply(this, _args(arguments));
};


/**
 * Retrieve event listeners for an `eventType` from the client.
 * If no `eventType` is provided, it will retrieve all listeners for every event type.
 *
 * @returns array of listeners for the `eventType`; if no `eventType`, then a map/hash object of listeners for all event types; or `null`
 */
ClipAndFile.prototype.handlers = function(/* eventType */) {
  return _clientListeners.apply(this, _args(arguments));
};


/**
 * Event emission receiver from the Flash object for this client's registered JavaScript event listeners.
 *
 * @returns For the "copy" event, returns the Flash-friendly "clipData" object; otherwise `undefined`.
 */
ClipAndFile.prototype.emit = function(/* event */) {
  return _clientEmit.apply(this, _args(arguments));
};


/**
 * Register clipboard actions for new element(s) to the client.
 *
 * @returns `this`
 */
ClipAndFile.prototype.clip = function(/* elements */) {
  return _clientClip.apply(this, _args(arguments));
};


/**
 * Unregister the clipboard actions of previously registered element(s) on the page.
 * If no elements are provided, ALL registered elements will be unregistered.
 *
 * @returns `this`
 */
ClipAndFile.prototype.unclip = function(/* elements */) {
  return _clientUnclip.apply(this, _args(arguments));
};


/**
 * Get all of the elements to which this client is clipped.
 *
 * @returns array of clipped elements
 */
ClipAndFile.prototype.elements = function() {
  return _clientElements.apply(this, _args(arguments));
};


/**
 * Self-destruct and clean up everything for a single client.
 * This will NOT destroy the embedded Flash object.
 *
 * @returns `undefined`
 */
ClipAndFile.prototype.destroy = function() {
  return _clientDestroy.apply(this, _args(arguments));
};


/**
 * Stores the pending plain text to inject into the clipboard.
 *
 * @returns `this`
 */
ClipAndFile.prototype.setText = function(text) {
  ClipAndFile.setData("text/plain", text);
  return this;
};


/**
 * Stores the pending HTML text to inject into the clipboard.
 *
 * @returns `this`
 */
ClipAndFile.prototype.setHtml = function(html) {
  ClipAndFile.setData("text/html", html);
  return this;
};


/**
 * Stores the pending rich text (RTF) to inject into the clipboard.
 *
 * @returns `this`
 */
ClipAndFile.prototype.setRichText = function(richText) {
  ClipAndFile.setData("application/rtf", richText);
  return this;
};


/**
 * Stores the pending data to inject into the clipboard.
 *
 * @returns `this`
 */
ClipAndFile.prototype.setData = function(/* format, data */) {
  ClipAndFile.setData.apply(this, _args(arguments));
  return this;
};


/**
 * Stores the pending data to save as a file.  Call only once.
 *
 * @returns `this`
 */
ClipAndFile.prototype.setFile = function(/* filename, data, isBase64 */) {
  ClipAndFile.setFile.apply(this, _args(arguments));
  return this;
};


/**
 * Clears the pending data to inject into the clipboard.
 * If no `format` is provided, all pending data formats will be cleared.
 *
 * @returns `this`
 */
ClipAndFile.prototype.clearData = function(/* format */) {
  ClipAndFile.clearData.apply(this, _args(arguments));
  return this;
};
