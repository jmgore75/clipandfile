/**
 * Keep track of the ClipAndFile client instance counter.
 */
var _clientIdCounter = 0;


/**
 * Keep track of the state of the client instances.
 *
 * Entry structure:
 *   _clientMeta[client.id] = {
 *     instance: client,
 *     elements: [],
 *     handlers: {}
 *   };
 */
var _clientMeta = {};


/**
 * Keep track of the ClipAndFile clipped elements counter.
 */
var _elementIdCounter = 0;


/**
 * Keep track of the state of the clipped element relationships to clients.
 *
 * Entry structure:
 *   _elementMeta[element.cafClippingId] = [client1.id, client2.id];
 */
var _elementMeta = {};


/**
 * Keep track of the state of the mouse event handlers for clipped elements.
 *
 * Entry structure:
 *   _mouseHandlers[element.cafClippingId] = {
 *     mouseover: function(event) {},
 *     mouseout:  function(event) {},
 *     mousedown: function(event) {},
 *     mouseup:   function(event) {}
 *   };
 */
var _mouseHandlers = {};


/**
 * Extending the ClipAndFile configuration defaults for the Client module.
 */
_extend(_globalConfig, {

  // Setting this to `false` would allow users to handle calling
  // `ClipAndFile.activate(...);` themselves instead of relying on our
  // per-element `mouseover` handler.
  autoActivate: true

});
