"use strict";
const path = require("path");
const fs = require("fs-extra");

module.exports = {
  getResource: function() {
    const language = global.language;
    const file = path.join(__dirname, "i18n", `${language}.json`);

    if(fs.existsSync(file)) {
      var resource = require(file);
      return resource;
    }

    return undefined;
  },
  translate: function(key) {
    const resource = this.getResource();
    const entry = resource[key];
    return entry || key;
  }
};