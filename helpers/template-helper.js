"use strict";

const path = require("path");
const fs = require("fs-extra");

function read(fileName) {
  const contents = fs.readFileSync(path.join(__dirname, "..", "templates", fileName));
  return contents.toString();
}

module.exports = {
  ContractTemplate: read("contract.md"),
  FunctionTemplate: read("function.md"),
  ModifierTemplate: read("modifier.md"),
  TableHeaderTemplate: read("table-header.md")
};