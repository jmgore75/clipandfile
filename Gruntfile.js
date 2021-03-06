/*jshint -W106 */
/*jshint node:true, maxstatements: false, maxlen: false */

var os = require("os");
var path = require("path");

module.exports = function(grunt) {
  "use strict";

  // Metadata
  var pkg = grunt.file.readJSON("package.json");

  // Make a temp dir for Flash compilation
  var tmpDir = os.tmpdir ? os.tmpdir() : os.tmpDir();
  var flashTmpDir = path.join(tmpDir, "zcflash");

  // Shared configuration
  var localPort = 7320;  // "ZERO"

  // Project configuration.
  var config = {
    // Task configuration
    jshint: {
      options: {
        jshintrc: true
      },
      Gruntfile: ["Gruntfile.js"],
      js: ["src/js/**/*.js", "!src/js/start.js", "!src/js/end.js"],
      test: ["test/**/*.js"],
      dist: ["dist/*.js", "!dist/*.min.js"]
    },
    flexpmd: {
      flash: {
        src: [flashTmpDir]
      }
    },
    clean: {
      dist: ["ClipAndFile.*", "dist/ClipAndFile.*"],
      flash: {
        options: {
          // Force is required when trying to clean outside of the project dir
          force: true
        },
        src: [flashTmpDir]
      },
      meta: ["bower.json", "composer.json", "LICENSE"]
    },
    concat: {
      options: {
        stripBanners: false,
        process: {
          data: pkg
        }
      },
      core: {
        src: [
          "src/meta/source-banner.tmpl",
          "src/js/start.js",
          "src/js/shared/state.js",
          "src/js/shared/private.js",
          "src/js/core/state.js",
          "src/js/core/private.js",
          "src/js/core/api.js",
          "src/js/end.js"
        ],
        dest: "dist/ClipAndFile.Core.js"
      },
      client: {
        src: [
          "src/meta/source-banner.tmpl",
          "src/js/start.js",
          "src/js/shared/state.js",
          "src/js/shared/private.js",
          "src/js/core/state.js",
          "src/js/core/private.js",
          "src/js/core/api.js",
          "src/js/client/state.js",
          "src/js/client/private.js",
          "src/js/client/api.js",
          "src/js/end.js"
        ],
        dest: "dist/ClipAndFile.js"
      },
      flash: {
        files: [
          {
            src: [
              "src/meta/source-banner.tmpl",
              "src/flash/ClipAndFile.as"
            ],
            dest: path.join(flashTmpDir, "ClipAndFile.as")
          },
          {
            src: [
              "src/meta/source-banner.tmpl",
              "src/flash/ClipboardInjector.as"
            ],
            dest: path.join(flashTmpDir, "ClipboardInjector.as")
          },
          {
            src: [
              "src/meta/source-banner.tmpl",
              "src/flash/JsProxy.as"
            ],
            dest: path.join(flashTmpDir, "JsProxy.as")
          },
          {
            src: [
              "src/meta/source-banner.tmpl",
              "src/flash/XssUtils.as"
            ],
            dest: path.join(flashTmpDir, "XssUtils.as")
          }
        ]
      }
    },
    uglify: {
      options: {
        report: "min"
      },
      js: {
        options: {
          preserveComments: function(node, comment) {
            return comment &&
              comment.type === "comment2" &&
              /^(!|\*|\*!)\r?\n/.test(comment.value);
          },
          beautify: {
            beautify: true,
            // `indent_level` requires jshint -W106
            indent_level: 2
          },
          mangle: false,
          compress: false
        },
        files: [
          {
            src: ["<%= concat.core.dest %>"],
            dest: "<%= concat.core.dest %>"
          },
          {
            src: ["<%= concat.client.dest %>"],
            dest: "<%= concat.client.dest %>"
          }
        ]
      },
      minjs: {
        options: {
          preserveComments: function(node, comment) {
            return comment &&
              comment.type === "comment2" &&
              /^(!|\*!)\r?\n/.test(comment.value);
          },
          sourceMap: true,
          // Bundles the contents of "`src`" into the "`dest`.map" source map file. This way,
          // consumers only need to host the "*.min.js" and "*.min.map" files rather than
          // needing to host all three files: "*.js", "*.min.js", and "*.min.map".
          sourceMapIncludeSources: true
        },
        files: [
          {
            src: ["<%= concat.core.dest %>"],
            dest: "dist/ClipAndFile.Core.min.js"
          },
          {
            src: ["<%= concat.client.dest %>"],
            dest: "dist/ClipAndFile.min.js"
          }
        ]
      }
    },
    mxmlc: {
      options: {
        rawConfig: "-target-player=11.0.0 -static-link-runtime-shared-libraries=true"
      },
      swf: {
        files: {
          "dist/ClipAndFile.swf": ["<%= concat.flash.files[0].dest %>"]
        }
      }
    },
    template: {
      options: {
        data: pkg
      },
      bower: {
        files: {
          "bower.json": ["src/meta/bower.json.tmpl"]
        }
      },
      composer: {
        files: {
          "composer.json": ["src/meta/composer.json.tmpl"]
        }
      },
      LICENSE: {
        files: {
          "LICENSE": ["src/meta/LICENSE.tmpl"]
        }
      }
    },
    chmod: {
      options: {
        mode: "444"
      },
      dist: ["dist/ClipAndFile.*"],
      meta: ["bower.json", "composer.json", "LICENSE"]
    },
    connect: {
      server: {
        options: {
          port: localPort
        }
      }
    },
    qunit: {
      file: [
        "test/shared/private.tests.js.html",
        "test/core/private.tests.js.html",
        "test/core/api.tests.js.html",
        "test/client/private.tests.js.html",
        "test/client/api.tests.js.html",
        "test/built/ClipAndFile.Core.tests.js.html",
        "test/built/ClipAndFile.tests.js.html"
        //"test/**/*.tests.js.html"
      ],
      http: {
        options: {
          urls:
            grunt.file.expand([
              "test/shared/private.tests.js.html",
              "test/core/private.tests.js.html",
              "test/core/api.tests.js.html",
              "test/client/private.tests.js.html",
              "test/client/api.tests.js.html",
              "test/built/ClipAndFile.Core.tests.js.html",
              "test/built/ClipAndFile.tests.js.html"
              //"test/**/*.tests.js.html"
            ]).map(function(testPage) {
              return "http://localhost:" + localPort + "/" + testPage + "?noglobals=true";
            })
        }
      }
    },
    watch: {
      options: {
        spawn: false
      },
      Gruntfile: {
        files: "<%= jshint.Gruntfile %>",
        tasks: ["jshint:Gruntfile"]
      },
      js: {
        files: "<%= jshint.js %>",
        tasks: ["jshint:js", "unittest"]
      },
      test: {
        files: "<%= jshint.test %>",
        tasks: ["jshint:test", "unittest"]
      }
    }
  };
  grunt.initConfig(config);

  // These plugins provide necessary tasks
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-flexpmd");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-mxmlc");
  grunt.loadNpmTasks("grunt-template");
  grunt.loadNpmTasks("grunt-chmod");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-qunit");
  grunt.loadNpmTasks("grunt-contrib-watch");


  // Task aliases and chains
  grunt.registerTask("jshint-prebuild", ["jshint:Gruntfile", "jshint:js", "jshint:test"]);
  grunt.registerTask("prep-flash",      ["clean:flash", "concat:flash"]);
  grunt.registerTask("validate",        ["jshint-prebuild", "prep-flash", "flexpmd"]);
  grunt.registerTask("build",           ["clean", "concat", "jshint:dist", "uglify", "mxmlc", "template", "chmod"]);
  grunt.registerTask("build-travis",    ["clean:dist", "concat", "jshint:dist", "mxmlc", "chmod:dist"]);
  grunt.registerTask("test",            ["connect", "qunit"]);

  // Default task
  grunt.registerTask("default", ["validate", "build", "test"]);
  // Travis CI task
  grunt.registerTask("travis",  ["validate", "build-travis", "test"]);

};
