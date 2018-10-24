"use strict";

const exec = require("child_process").exec;
const pino = require("pino");

const logger = pino({
  prettyPrint: true
});

module.exports = {
  compile: function(pathToRoot) {
    logger.info("Compiling %s", pathToRoot);

    const process = exec("truffle compile", {
      cwd: pathToRoot
    });

    process.stdout.on("data", function(data) {
      console.log("stdout: " + data);
    });

    process.stderr.on("data", function(data) {
      console.log("stdout: " + data);
    });

    process.on("close", function(code) {
      console.log("closing code: " + code);
    });
  }
};