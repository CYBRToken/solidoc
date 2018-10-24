"use strict";
const pino = require("pino");
const path = require("path");
const fs = require("fs");
const temp = require("./helpers/template-helper");

const logger = pino({
  prettyPrint: true
});

function serializeContract(contract, contracts) {
  var template = temp.ContractTemplate;

  require("require-all")({
    dirname: path.join(__dirname, "serializers"),
    filter: /(.+serializer)\.js$/,
    resolve: function(serializer) {
      template = serializer.serialize(contract, template, contracts);
    }
  });

  return template;
}

module.exports = {
  serialize: function(contracts, outputDirectory) {
    logger.info("Total contracts: %s.", contracts.length);

    for(let i = 0; i < contracts.length; i++) {
      const contract = contracts[i];
      const result = serializeContract(contract, contracts).replace(/[\r\n]\s*[\r\n]/g, "\n\n");
      const file = path.join(outputDirectory, `${contract.contractName}.md`);

      logger.info("Writing %s.", file);
      fs.writeFileSync(file, result);
    }

    // console.log(serializers.length);
  }
};