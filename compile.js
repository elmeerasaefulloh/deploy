const fs = require('fs');
const solc = require('solc');

const source = fs.readFileSync('SimpleStorage.sol', 'utf8');
const input = {
    language: 'Solidity',
    sources: {
        'SimpleStorage.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode'],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const abi = output.contracts['SimpleStorage.sol'].SimpleStorage.abi;
const bytecode = output.contracts['SimpleStorage.sol'].SimpleStorage.evm.bytecode.object;

fs.writeFileSync('SimpleStorage_abi.json', JSON.stringify(abi, null, 2));
fs.writeFileSync('SimpleStorage_bytecode.txt', bytecode);
