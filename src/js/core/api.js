/**
 * A shell constructor for `ClipAndFile` client instances.
 *
 * @constructor
 */
var ClipAndFile = function() {

  // Ensure the constructor is invoked with the `new` keyword.
  if (!(this instanceof ClipAndFile)) {
    return new ClipAndFile();
  }

  // EXTREMELY IMPORTANT!
  // Ensure the `ClipAndFile._createClient` function is invoked if available.
  // This allows an extension point for 3rd parties to create their own
  // interpretations of what a ClipAndFile "Client" should be like.
  if (typeof ClipAndFile._createClient === "function") {
    ClipAndFile._createClient.apply(this, _args(arguments));
  }

};


/**
 * The ClipAndFile library's version number.
 *
 * @static
 * @readonly
 * @property {string}
 */
ClipAndFile.version = "<%= version %>";
_makeReadOnly(ClipAndFile, "version");


/**
 * Update or get a copy of the ClipAndFile global configuration.
 * Returns a copy of the current/updated configuration.
 *
 * @returns Object
 * @static
 */
ClipAndFile.config = function(/* options */) {
  return _config.apply(this, _args(arguments));
};


/**
 * Diagnostic method that describes the state of the browser, Flash Player, and ClipAndFile.
 *
 * @returns Object
 * @static
 */
ClipAndFile.state = function() {
  return _state.apply(this, _args(arguments));
};


/**
 * Check if Flash is unusable for any reason: disabled, outdated, deactivated, etc.
 *
 * @returns Boolean
 * @static
 */
ClipAndFile.isFlashUnusable = function() {
  return _isFlashUnusable.apply(this, _args(arguments));
};


/**
 * Register an event listener.
 *
 * @returns `ClipAndFile`
 * @static
 */
ClipAndFile.on = function(/* eventType, listener */) {
  return _on.apply(this, _args(arguments));
};


/**
 * Unregister an event listener.
 * If no `listener` function/object is provided, it will unregister all listeners for the provided `eventType`.
 * If no `eventType` is provided, it will unregister all listeners for every event type.
 *
 * @returns `ClipAndFile`
 * @static
 */
ClipAndFile.off = function(/* eventType, listener */) {
  return _off.apply(this, _args(arguments));
};


/**
 * Retrieve event listeners for an `eventType`.
 * If no `eventType` is provided, it will retrieve all listeners for every event type.
 *
 * @returns array of listeners for the `eventType`; if no `eventType`, then a map/hash object of listeners for all event types; or `null`
 */
ClipAndFile.handlers = function(/* eventType */) {
  return _listeners.apply(this, _args(arguments));
};


/**
 * Event emission receiver from the Flash object, forwarding to any registered JavaScript event listeners.
 *
 * @returns For the "copy" event, returns the Flash-friendly "clipData" object; otherwise `undefined`.
 * @static
 */
ClipAndFile.emit = function(/* event */) {
  return _emit.apply(this, _args(arguments));
};


/**
 * Create and embed the Flash object.
 *
 * @returns The Flash object
 * @static
 */
ClipAndFile.create = function() {
  return _create.apply(this, _args(arguments));
};


/**
 * Self-destruct and clean up everything, including the embedded Flash object.
 *
 * @returns `undefined`
 * @static
 */
ClipAndFile.destroy = function() {
  return _destroy.apply(this, _args(arguments));
};


/**
 * Set the pending data for clipboard injection.
 *
 * @returns `undefined`
 * @static
 */
ClipAndFile.setData = function(/* format, data */) {
  return _setData.apply(this, _args(arguments));
};


/**
 * Stores the pending data to save as a file.  Call only once.
 *
 * @returns `this`
 */
ClipAndFile.prototype.setFile = function(/* filename, data, isBase64 */) {
  return _setFile.apply(this, _args(arguments));
};


/**
 * Clear the pending data for clipboard injection.
 * If no `format` is provided, all pending data formats will be cleared.
 *
 * @returns `undefined`
 * @static
 */
ClipAndFile.clearData = function(/* format */) {
  return _clearData.apply(this, _args(arguments));
};


/**
 * Sets the current HTML object that the Flash object should overlay. This will put the global
 * Flash object on top of the current element; depending on the setup, this may also set the
 * pending clipboard text data as well as the Flash object's wrapping element's title attribute
 * based on the underlying HTML element and ClipAndFile configuration.
 *
 * @returns `undefined`
 * @static
 */
ClipAndFile.activate = function(/* element */) {
  return _activate.apply(this, _args(arguments));
};


/**
 * Un-overlays the Flash object. This will put the global Flash object off-screen; depending on
 * the setup, this may also unset the Flash object's wrapping element's title attribute based on
 * the underlying HTML element and ClipAndFile configuration.
 *
 * @returns `undefined`
 * @static
 */
ClipAndFile.deactivate = function() {
  return _deactivate.apply(this, _args(arguments));
};
