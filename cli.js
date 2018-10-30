#!/usr/bin/env node
"use strict";

const path = require("path");
const resolve = require("path").resolve;
const fs = require("fs-extra");
const compiler = require("./utils/compiler");
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
function getConfig() {
  function readConfig() {
    const file = path.join(process.cwd(), "solidoc.json");

    if(!fs.pathExistsSync(file)) {
      return {};
    }

    const contents = fs.readFileSync(file);
    const config = JSON.parse(contents.toString());

    return config;
  };

  var config = readConfig();
  const args = process.argv;

  if(args.length > 6) {
    logger.error(`Invalid command ${process.argv.join(" ")}`);
    return;
  }

  if(args.length > 2) {
    config.pathToRoot = args[2];
    config.outputPath = args[3];
    config.noCompilation = (args[4] || "").toLowerCase().startsWith("t");
    config.language = args[5] || "en";
  }

  config.pathToRoot = resolve(config.pathToRoot);
  config.outputPath = resolve(config.outputPath);

  return config;
}

const config = getConfig();
global.config = config;

if(!config.pathToRoot) {
  logger.error("Path to truffle project root was not specified.");
  return;
}

const buildDirectory = path.join(config.pathToRoot, "build");

if(!fs.existsSync(config.pathToRoot)) {
  logger.error("Invalid directory: %s.", config.pathToRoot);
  return;
}

function begin() {
  if(!fs.existsSync(buildDirectory)) {
    logger.error("Please build your project first or run solidoc with recompilation on.");
    return;
  }

  if(!fs.existsSync(config.outputPath)) {
    logger.info("Create the directory for the output path: %s.");
    fs.mkdirSync(config.outputPath);
  }

  const contracts = parser.parse(buildDirectory);
  generator.serialize(contracts, config.outputPath);
}

if(!config.noCompilation) {
  fs.removeSync(buildDirectory);

  logger.info("Removed %s.", buildDirectory);
  compiler.compile(config.pathToRoot, begin);
  return;
}

begin();