/*global ClipAndFile */

(function(module, test) {
  "use strict";

  // Helper functions
  var TestUtils = {
    getHtmlBridge: function() {
      return document.getElementById(ClipAndFile.config("containerId"));
    }
  };

  var originalConfig, originalFlashDetect;


  module("ClipAndFile.Core.js (built) unit tests", {
    setup: function() {
      // Store
      originalConfig = ClipAndFile.config();
      originalFlashDetect = ClipAndFile.isFlashUnusable;
      // Modify
      ClipAndFile.isFlashUnusable = function() {
        return false;
      };
    },
    teardown: function() {
      // Restore
      ClipAndFile.destroy();
      ClipAndFile.config(originalConfig);
      ClipAndFile.isFlashUnusable = originalFlashDetect;
    }
  });


  test("`swfPath` finds the expected default URL", function(assert) {
    assert.expect(1);

    // Assert, act, assert
    var rootOrigin = window.location.protocol + "//" + window.location.host + "/";
    var indexOfTest = window.location.pathname.toLowerCase().indexOf("/test/");
    var rootDir = window.location.pathname.slice(1, indexOfTest + 1);
    var rootPath = rootOrigin + rootDir;
    //var cafJsUrl = rootPath + "dist/ClipAndFile.Core.js";
    var swfPathBasedOnClipAndFileJsPath = rootPath + "dist/ClipAndFile.swf";

    // Test that the client has the expected default URL [even if it's not correct]
    assert.strictEqual(ClipAndFile.config("swfPath"), swfPathBasedOnClipAndFileJsPath);
  });


  test("`destroy` destroys the bridge", function(assert) {
    assert.expect(3);

    // Arrange
    ClipAndFile.isFlashUnusable = function() {
      return false;
    };

    // Assert, arrange, assert, act, assert
    assert.equal(TestUtils.getHtmlBridge(), null, "The bridge does not exist before creating a client");
    ClipAndFile.create();
    assert.notEqual(TestUtils.getHtmlBridge(), null, "The bridge does exist after creating a client");
    ClipAndFile.destroy();
    assert.equal(TestUtils.getHtmlBridge(), null, "The bridge does not exist after calling `destroy`");
  });

})(QUnit.module, QUnit.test);
