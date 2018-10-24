# Solidoc: Documentation Generator for Solidity

This command-line utility creates markdown-based documentation for your Solidity project(s) for the following platforms:

* Ethereum
* Ethereum Classic
* Tron
* Qtum
* Wanchain
* Aeternity
* Counterparty
* Rootstock
* Ubiq
* Monax


## Getting Started

```
npm install solidoc -g
```

**CLI Arguments**

1. Path to truffle project root.
2. Path to generate documentation to.
3. Do not recompile. Optional, default: false.
4. Language. Optional, default: en.


**Edit package.json**


```json
  "scripts": {
    "solidoc": "solidoc ./ ./docs"
  }
```

**Run the Script to Generate Documentation**

```
npm run solidoc
```

This script will generate documentation to the `docs` directory.


**Note**

Do not recompile (third argument) if you are using this on a non truffle project.


## Before You Try:

- [OpenZeppelin Solidity Documentation](https://github.com/binodnp/openzeppelin-solidity/blob/master/docs/ERC721.md)
- [Open Source Vesting Schedule by Binod](https://github.com/binodnp/vesting-schedule/blob/master/docs/VestingSchedule.md)
- [Virtual Rehab Token](https://github.com/ViRehab/VirtualRehabToken/blob/master/docs/VRHToken.md)
- [Virtual Rehab Private Sale](https://github.com/ViRehab/VirtualRehabPrivateSale/blob/master/docs/PrivateSale.md)