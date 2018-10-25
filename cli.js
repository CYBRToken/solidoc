#!/usr/bin/env node
"use strict";

const path = require("path");
const resolve = require("path").resolve;
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

const pathToRoot = resolve(args[2]);
const outputPath = resolve(args[3]);
const noCompilation = (args[4] || "").toLowerCase().startsWith("t");

if(!pathToRoot) {
  logger.error("Path to truffle project root was not specified.");
  return;
}

const buildDirectory = path.join(pathToRoot, "build");

logger.debug("Path to root: %s.", pathToRoot);
logger.debug("Output path: %s.", outputPath);
logger.debug("Require recompilation: %s.", noCompilation);

if(!fs.existsSync(pathToRoot)) {
  logger.error("Invalid directory: %s.", pathToRoot);
  return;
}

function begin() {
  if(!fs.existsSync(buildDirectory)) {
    logger.error("Please build your project first or run solidoc with recompilation on.");
    return;
  }

  if(!fs.existsSync(outputPath)) {
    logger.info("Create the directory for the output path: %s.");
    fs.mkdirSync(outputPath);
  }

  global.pathToRoot = pathToRoot;
  global.outputPath = outputPath;
  global.noCompilation = noCompilation;
  global.language = args[5] || "en";

  const contracts = parser.parse(buildDirectory);
  generator.serialize(contracts, outputPath);
}

if(!noCompilation) {
  fs.removeSync(buildDirectory);

  logger.info("Removed %s.", buildDirectory);
  compiler.compile(pathToRoot, begin);
  return;
}

begin();