#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs-extra");
const compiler = require("./utils/truffle-compiler");
const pino = require("pino");
const parser = require("./parser");
const generator = require("./generator");

const logger = pino({
  prettyPrint: true
});

/***********************************************************************************************
    Arguments:
    1. Path to truffle project root.
    2. Path to generate documentation to.
    3. Do not recompile. Optional, default: false.
    4. Language. Optional, default: en.
*************************************************************************************************/
const args = process.argv;

if(args.length > 6) {
  logger.error(`Invalid command ${process.argv.join(" ")}`);
  return;
}

const pathToRoot = args[2];
const outputPath = args[3];
const noCompilation = (args[4] || "").toLowerCase().startsWith("t");
global.language = args[5] || "en";
const buildDirectory = path.join(pathToRoot, "build");

logger.debug("Path to root: %s.", pathToRoot);
logger.debug("Output path: %s.", outputPath);
logger.debug("Require recompilation: %s.", noCompilation);

if(!fs.existsSync(pathToRoot)) {
  logger.error("Invalid directory: %s.", pathToRoot);
}

if(!noCompilation) {
  fs.remove(buildDirectory, function() {
    logger.info("Removed %s.", buildDirectory);
    compiler.compile(pathToRoot);
  });
}

if(!fs.existsSync(outputPath)) {
  logger.info("Create the directory for the output path: %s.");
  fs.mkdirSync(outputPath);
}

const contracts = parser.parse(buildDirectory);
generator.serialize(contracts, outputPath);